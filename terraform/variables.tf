variable "aws_region" {
  description = "The aws region where the resources will be created"
  default     = "us-east-1"
}

variable "deploy_name" {
  description = "It will be used to identify the resoruces with the tag"
  default     = "mms-kio"
}

variable "aws_ecs_amis" {
  description = "ECS optimized AMIs for different regions"

  default = {
    us-east-1      = "ami-00129b193dc81bc31"
    us-east-2      = "ami-028a9de0a7e353ed9"
    us-west-1      = "ami-0d438d09af26c9583"
    us-west-2      = "ami-00d4f478"
    eu-west-1      = "ami-0af844a965e5738db"
    eu-west-2      = "ami-a44db8c3"
    eu-central-1   = "ami-0291ba887ba0d515f"
    ap-northeast-1 = "ami-0041c416aa23033a2"
    ap-southeast-1 = "ami-091bf462afdb02c60"
    ap-southeast-2 = "ami-0092e55c70015d8c3"
    ca-central-1   = "ami-192fa27d"
  }
}
