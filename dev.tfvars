region = "eu-west-1"
prefix = "dev"

# EC2
ec2_ami           = "ami-089cc16f7f08c4457"
ec2_instance_type = "t2.micro"

# VPC
vpc_name                         = "example-vpc"
vpc_cidr                         = "10.0.0.0/16"
vpc_azs                          = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
vpc_database_subnets             = ["10.0.201.0/24", "10.0.202.0/24"]
vpc_create_database_subnet_group = true
vpc_database_subnet_suffix       = "db"
vpc_private_subnets              = ["10.0.1.0/24", "10.0.2.0/24"]
vpc_public_subnet_suffix         = "public"
vpc_public_subnets               = ["10.0.101.0/24", "10.0.102.0/24"]
vpc_private_subnet_suffix        = "private"
vpc_enable_nat_gateway           = true
vpc_tags = {
  Terraform   = "true"
  Environment = "dev"
}

# COGNITO
cognito_callback_urls        = ["http://localhost:3000/login-success/"]
cognito_default_redirect_uri = "http://localhost:3000/login-success/"
cognito_logout_urls          = ["http://localhost:3000/sign-out-success/"]
