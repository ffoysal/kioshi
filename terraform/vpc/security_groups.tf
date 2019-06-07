# security group for alb
resource "aws_security_group" "alb" {
  name        = "${var.deploy_name}_alb_sg"
  description = "ALB access control"
  vpc_id      = "${aws_vpc.kioshi_main.id}"

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name       = "${var.deploy_name}_alb_sg"
    deployment = "${var.deploy_name}"
  }
}

# ECS will receive traffic from ALB only
resource "aws_security_group" "ecs" {
  name        = "${var.deploy_name}_ecs_sg"
  description = "allow inbound access from the ALB only"
  vpc_id      = "${aws_vpc.kioshi_main.id}"

  ingress {
    protocol        = "tcp"
    from_port       = "${var.application_port}"
    to_port         = "${var.application_port}"
    security_groups = ["${aws_security_group.alb.id}"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name       = "${var.deploy_name}_ecs_sg"
    deployment = "${var.deploy_name}"
  }
}

# DB will receive traffic from ECS only
resource "aws_security_group" "db" {
  name        = "${var.deploy_name}_db_sg"
  description = "allow inbound access from ECS only"
  vpc_id      = "${aws_vpc.kioshi_main.id}"

  ingress {
    protocol        = "tcp"
    from_port       = "27017"
    to_port         = "27017"
    security_groups = ["${aws_security_group.ecs.id}"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name       = "${var.deploy_name}_ecs_sg"
    deployment = "${var.deploy_name}"
  }
}
