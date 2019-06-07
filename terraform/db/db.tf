data "template_file" "aws_ec2_instance_config" {
  template = "${file("${path.module}/awsconfig.userdata")}"
}

resource "aws_instance" "db" {
  ami             = "${lookup(var.aws_ecs_amis, var.aws_region)}"
  instance_type   = "t2.micro"
  subnet_id       = "${var.db_subnet_id}"
  user_data       = "${data.template_file.aws_ec2_instance_config.rendered}"
  security_groups = ["${var.db_sg}"]

  tags = {
    Name       = "${var.deploy_name}-db"
    deployment = "${var.deploy_name}"
  }
}
