output "ecs_exec_role_arn" {
  value = "${aws_iam_role.ecs_instance_role.arn}"
}
