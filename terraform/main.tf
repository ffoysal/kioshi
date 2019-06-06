module "kio_vpc" {
  source      = "./vpc"
  deploy_name = "${var.deploy_name}"
}

module "db" {
  source       = "./db"
  deploy_name  = "${var.deploy_name}"
  aws_region   = "${var.aws_region}"
  aws_ecs_amis = "${var.aws_ecs_amis}"
  db_subnet_id = "${module.kio_vpc.db_subnet_id}"
  db_sg        = "${module.kio_vpc.db_sg}"
}

module "kio_iam" {
  source      = "./iam"
  deploy_name = "${var.deploy_name}"
}

module "app_ecs" {
  source                  = "./ecs"
  deploy_name             = "${var.deploy_name}"
  aws_region              = "${var.aws_region}"
  ecs_sg                  = ["${module.kio_vpc.ecs_sg}"]
  alb_sg                  = ["${module.kio_vpc.alb_sg}"]
  ecs_subnet_ids          = "${module.kio_vpc.ecs_subnet_ids}"
  alb_subnet_ids          = "${module.kio_vpc.alb_subnet_ids}"
  vpc_id                  = "${module.kio_vpc.vpc_id}"
  ecs_task_execution_role = "${module.kio_iam.ecs_exec_role_arn}"
  db_ip                   = "${module.db.db_ip}"
  ecs_auto_scale_role_arn = "${module.kio_iam.ecs_auto_scale_role_arn}"
}
