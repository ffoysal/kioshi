# ECS instance role
resource "aws_iam_role" "ecs_instance_role" {
  name               = "${var.deploy_name}-ecs-instance-role"
  assume_role_policy = "${file("${path.module}/ecs_instance_role.json")}"
}

# ECS instance role policy template
data "template_file" "ecs_instance_role_policy_template" {
  template = "${file("${path.module}/ecs_instance_role_policy.json")}"
}

# ECS instance role policy
resource "aws_iam_role_policy" "mage_instance_role_policy" {
  name   = "${var.deploy_name}-ecs-instance-role-policy"
  role   = "${aws_iam_role.ecs_instance_role.name}"
  policy = "${data.template_file.ecs_instance_role_policy_template.rendered}"
}

# ECS auto scale role
resource "aws_iam_role" "ecs_autoscale_role" {
  name = "${var.deploy_name}-ecs-autoscale-role"

  assume_role_policy = "${file("${path.module}/ecs_autoscale_role.json")}"
}

# Attach a managed iam policy to the ecs auto scale role
resource "aws_iam_role_policy_attachment" "ecs_autoscale_role_policy_attachment" {
  role       = "${aws_iam_role.ecs_autoscale_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceAutoscaleRole"
}
