output "db_ip" {
  value = "${aws_instance.db.private_ip}"
}
