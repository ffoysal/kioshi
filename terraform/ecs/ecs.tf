resource "aws_ecs_cluster" "cluster" {
  name = "${var.deploy_name}-backend-cluster"
}

data "template_file" "container_template" {
  template = "${file("${path.module}/containers.json.tpl")}"

  vars {
    aws_region     = "${var.aws_region}"
    log_group_name = "${aws_cloudwatch_log_group.app_log_group.name}"
    db_ip          = "${var.db_ip}"
    swagger_uri    = "${aws_alb.main.dns_name}"
  }
}

resource "aws_ecs_task_definition" "kioishi_task" {
  family                   = "${var.deploy_name}-mms-app"
  execution_role_arn       = "${var.ecs_task_execution_role}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 2048
  container_definitions    = "${data.template_file.container_template.rendered}"
}

resource "aws_ecs_service" "kioshi_service" {
  name                              = "${var.deploy_name}-kioshi_service"
  cluster                           = "${aws_ecs_cluster.cluster.id}"
  task_definition                   = "${aws_ecs_task_definition.kioishi_task.arn}"
  desired_count                     = "${var.app_count}"
  launch_type                       = "FARGATE"
  health_check_grace_period_seconds = 30

  network_configuration {
    security_groups = ["${var.ecs_sg}"]
    subnets         = ["${var.ecs_subnet_ids}"]
  }

  load_balancer {
    target_group_arn = "${aws_alb_target_group.app.id}"
    container_name   = "kioshi"
    container_port   = "3000"
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 100

  depends_on = [
    "aws_alb_listener.front_end",
  ]
}
