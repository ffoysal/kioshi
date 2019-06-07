output "ecs_sg" {
  value = "${aws_security_group.ecs.id}"
}

output "alb_sg" {
  value = "${aws_security_group.alb.id}"
}

output "db_sg" {
  value = "${aws_security_group.db.id}"
}

output "ecs_subnet_ids" {
  value = ["${aws_subnet.private_app.id}"]
}

output "db_subnet_id" {
  value = "${aws_subnet.private_db.id}"
}

output "alb_subnet_ids" {
  value = ["${aws_subnet.public_a.id}", "${aws_subnet.public_b.id}"]
}

output "vpc_id" {
  value = "${aws_vpc.kioshi_main.id}"
}
