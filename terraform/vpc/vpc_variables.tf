variable "deploy_name" {}

variable "az_count" {
  default     = 2
  description = "Number of AZs for this deployment"
}

variable "application_port" {
  default = 3000
}
