resource "aws_cloudwatch_log_group" "app_log_group" {
  name              = "${var.deploy_name}-ecs"
  retention_in_days = 30

  tags {
    Name = "${var.deploy_name}"
  }
}
