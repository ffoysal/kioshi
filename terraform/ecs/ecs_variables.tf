variable "deploy_name" {}
variable "aws_region" {}

variable "app_count" {
  description = "Number of containers running"
  default     = 2
}

variable "ecs_sg" {
  description = "ECS task security group"
  type        = "list"
}

variable "alb_sg" {
  description = "ALB security group"
  type        = "list"
}

variable "ecs_subnet_ids" {
  description = "Subnets where the app container will be running"
  type        = "list"
}

variable "alb_subnet_ids" {
  description = "Subnets where alb will running"
  type        = "list"
}

variable "vpc_id" {
  description = "VPC ID"
}

variable "ecs_task_execution_role" {}

variable "db_ip" {}

variable "ecs_auto_scale_role_arn" {}
