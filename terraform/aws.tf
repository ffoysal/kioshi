provider "aws" {
  version                 = "1.60.0"
  shared_credentials_file = "$HOME/.aws/credentials"
  profile                 = "default"
  region                  = "${var.aws_region}"
}
