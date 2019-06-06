resource "aws_alb" "main" {
  name            = "${var.deploy_name}-alb"
  subnets         = ["${var.alb_subnet_ids}"]
  security_groups = ["${var.alb_sg}"]

  tags = {
    deployment = "${var.deploy_name}"
  }
}

resource "aws_alb_target_group" "app" {
  name        = "${var.deploy_name}-app-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = "${var.vpc_id}"
  target_type = "ip"

  health_check {
    protocol            = "HTTP"
    matcher             = "200"
    path                = "/health"
    unhealthy_threshold = "2"
    healthy_threshold   = "2"
  }

  tags = {
    deployment = "${var.deploy_name}"
  }
}

# Redirect all traffic from the ALB to the target group
resource "aws_alb_listener" "front_end" {
  load_balancer_arn = "${aws_alb.main.id}"
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_alb_target_group.app.id}"
    type             = "forward"
  }
}
