resource "aws_vpc" "kioshi_main" {
  cidr_block = "10.8.0.0/16"

  tags = {
    Name       = "${var.deploy_name}"
    deployment = "${var.deploy_name}"
  }
}

data "aws_availability_zones" "available_azs" {}

locals {
  private_db_cidr = "${cidrsubnet(aws_vpc.kioshi_main.cidr_block, 8, 1)}"
  private_db_az   = "${data.aws_availability_zones.available_azs.names[0]}"

  private_app_cidr = "${cidrsubnet(aws_vpc.kioshi_main.cidr_block, 8, 2)}"
  private_app_az   = "${data.aws_availability_zones.available_azs.names[1]}"

  public_a_cidr = "${cidrsubnet(aws_vpc.kioshi_main.cidr_block, 8, 3)}"
  public_a_az   = "${data.aws_availability_zones.available_azs.names[0]}"

  public_b_cidr = "${cidrsubnet(aws_vpc.kioshi_main.cidr_block, 8, 4)}"
  public_b_az   = "${data.aws_availability_zones.available_azs.names[1]}"
}

# Create one private subnet for database
resource "aws_subnet" "private_db" {
  cidr_block        = "${local.private_db_cidr}"
  availability_zone = "${local.private_db_az}"
  vpc_id            = "${aws_vpc.kioshi_main.id}"

  tags = {
    Name       = "${var.deploy_name}-${local.private_db_az}-private-${local.private_db_cidr}"
    deployment = "${var.deploy_name}"
  }
}

# create one private subnet for app
resource "aws_subnet" "private_app" {
  cidr_block        = "${local.private_app_cidr}"
  availability_zone = "${local.private_app_az}"
  vpc_id            = "${aws_vpc.kioshi_main.id}"

  tags = {
    Name       = "${var.deploy_name}-${local.private_app_az}-private-${local.private_app_cidr}"
    deployment = "${var.deploy_name}"
  }
}

# Create public subnets for alb
resource "aws_subnet" "public_a" {
  cidr_block              = "${local.public_a_cidr}"
  availability_zone       = "${local.public_a_az}"
  vpc_id                  = "${aws_vpc.kioshi_main.id}"
  map_public_ip_on_launch = true

  tags = {
    Name       = "${var.deploy_name}-${local.public_a_az}-public-${local.public_a_cidr}"
    deployment = "${var.deploy_name}"
  }
}

# Create public subnets for alb
resource "aws_subnet" "public_b" {
  cidr_block              = "${local.public_b_cidr}"
  availability_zone       = "${local.public_b_az}"
  vpc_id                  = "${aws_vpc.kioshi_main.id}"
  map_public_ip_on_launch = true

  tags = {
    Name       = "${var.deploy_name}-${local.public_b_az}-public-${local.public_b_cidr}"
    deployment = "${var.deploy_name}"
  }
}

# IGW for the public subnet
resource "aws_internet_gateway" "kioshi_gw" {
  vpc_id = "${aws_vpc.kioshi_main.id}"

  tags = {
    Name       = "${var.deploy_name}"
    deployment = "${var.deploy_name}"
  }
}

# Route the public subnet trafic through the IGW
resource "aws_route" "internet_access" {
  route_table_id         = "${aws_vpc.kioshi_main.main_route_table_id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.kioshi_gw.id}"
}

# Create an elastic IP
resource "aws_eip" "elastic_ip" {
  vpc = true

  tags = {
    deployment = "${var.deploy_name}"
    Name       = "${var.deploy_name}"
  }
}

# Create a NAT gw and attach the eip to it
resource "aws_nat_gateway" "ngw" {
  count         = "1"
  subnet_id     = "${aws_subnet.public_a.id}"
  allocation_id = "${aws_eip.elastic_ip.id}"
  depends_on    = ["aws_internet_gateway.kioshi_gw"]

  tags = {
    Name       = "${var.deploy_name}"
    deployment = "${var.deploy_name}"
  }
}

# Create a new route table for private subnet and route through NAT gw
resource "aws_route_table" "private_table" {
  vpc_id = "${aws_vpc.kioshi_main.id}"

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = "${aws_nat_gateway.ngw.id}"
  }

  tags = {
    Name       = "${var.deploy_name}"
    deployment = "${var.deploy_name}"
  }
}

# associate route tables with private subnet
resource "aws_route_table_association" "asso_app" {
  subnet_id      = "${aws_subnet.private_app.id}"
  route_table_id = "${aws_route_table.private_table.id}"
}

resource "aws_route_table_association" "asso_db" {
  subnet_id      = "${aws_subnet.private_db.id}"
  route_table_id = "${aws_route_table.private_table.id}"
}
