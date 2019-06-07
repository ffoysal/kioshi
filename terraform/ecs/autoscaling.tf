# Define an application autoscaling scalable target
resource "aws_appautoscaling_target" "scaling_target" {
  max_capacity       = 4
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.cluster.name}/${aws_ecs_service.kioshi_service.name}"
  role_arn           = "${var.ecs_auto_scale_role_arn}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# Generate alarm for high cpu usages
resource "aws_cloudwatch_metric_alarm" "high_cpu_alarm" {
  alarm_name          = "${var.deploy_name}-high-cpu-alarm"
  alarm_description   = "This metric monitors high cpu utilization for mms service"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "75"

  dimensions {
    ClusterName = "${aws_ecs_cluster.cluster.name}"
    ServiceName = "${aws_ecs_service.kioshi_service.name}"
  }

  alarm_actions = ["${aws_appautoscaling_policy.scaling_out_policy.arn}"]
}

# Generate low cpu usages alarm
resource "aws_cloudwatch_metric_alarm" "low_cpu_alarm" {
  alarm_name          = "${var.deploy_name}-low-cpu-alarm"
  alarm_description   = "This metric monitors low cpu utilization for mms service"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "25"

  dimensions {
    ClusterName = "${aws_ecs_cluster.cluster.name}"
    ServiceName = "${aws_ecs_service.kioshi_service.name}"
  }

  alarm_actions = ["${aws_appautoscaling_policy.scaling_in_policy.arn}"]
}

# Define an application autoscaling policy for scaling out
resource "aws_appautoscaling_policy" "scaling_out_policy" {
  name = "${var.deploy_name}-scaling-out-policy"

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      scaling_adjustment          = 1
      metric_interval_lower_bound = 0.0
    }
  }

  policy_type        = "StepScaling"
  resource_id        = "service/${aws_ecs_cluster.cluster.name}/${aws_ecs_service.kioshi_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
  depends_on         = ["aws_appautoscaling_target.scaling_target"]
}

# Define an application autoscaling policy for scaling in
resource "aws_appautoscaling_policy" "scaling_in_policy" {
  name = "${var.deploy_name}-scaling-in-policy"

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      scaling_adjustment          = -1
      metric_interval_upper_bound = 0.0
    }
  }

  policy_type        = "StepScaling"
  resource_id        = "service/${aws_ecs_cluster.cluster.name}/${aws_ecs_service.kioshi_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
  depends_on         = ["aws_appautoscaling_target.scaling_target"]
}
