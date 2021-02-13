module "aurora" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "~> 3.0"

  name = var.app_name

  engine = "aurora-postgresql"

  engine_mode           = "serverless"
  engine_version        = null
  replica_scale_enabled = false
  replica_count         = 0
  enable_http_endpoint  = true

  subnets             = module.vpc_main.private_subnets
  vpc_id              = module.vpc_main.vpc_id
  monitoring_interval = 60
  skip_final_snapshot = true
  apply_immediately   = true
  storage_encrypted   = true

  db_parameter_group_name         = aws_db_parameter_group.aurora_db_postgresql10_parameter_group.id
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.aurora_cluster_postgresql10_parameter_group.id

  scaling_configuration = {
    auto_pause               = true
    min_capacity             = 2
    max_capacity             = 2
    seconds_until_auto_pause = 300
    timeout_action           = "ForceApplyCapacityChange"
  }
}

resource "aws_db_parameter_group" "aurora_db_postgresql10_parameter_group" {
  name        = "test-postgresql10-parameter-group"
  family      = "aurora-postgresql10"
  description = "test-postgresql10-parameter-group"
}

resource "aws_rds_cluster_parameter_group" "aurora_cluster_postgresql10_parameter_group" {
  name        = "test-postgresql10-cluster-parameter-group"
  family      = "aurora-postgresql10"
  description = "test-postgresql10-cluster-parameter-group"
}

resource "aws_security_group" "app_servers" {
  name        = "app-servers"
  description = "For application servers"
  vpc_id      = module.vpc_main.vpc_id
}

resource "aws_security_group_rule" "allow_access" {
  type                     = "ingress"
  from_port                = module.aurora.this_rds_cluster_port
  to_port                  = module.aurora.this_rds_cluster_port
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.app_servers.id
  security_group_id        = module.aurora.this_security_group_id
}

resource "aws_secretsmanager_secret" "rds_credentials" {
  name = "rds_credentials"
}

resource "aws_secretsmanager_secret_version" "rds_credentials" {
  secret_id = aws_secretsmanager_secret.rds_credentials.id
  secret_string = jsonencode(map(
    "username", module.aurora.this_rds_cluster_master_username,
    "password", module.aurora.this_rds_cluster_master_password
  ))
}
