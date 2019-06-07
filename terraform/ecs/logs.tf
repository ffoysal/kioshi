resource "aws_cloudwatch_log_group" "app_log_group" {
  name              = "${var.deploy_name}-ecs"
  retention_in_days = 30

  tags {
    Name = "${var.deploy_name}"
  }
}

/*
resource "aws_cloudwatch_log_stream" "app_log_stream" {
  name           = "${var.deploy_name}-app-log-stream"
  log_group_name = "${aws_cloudwatch_log_group.app_log_group.name}"
}
*/

