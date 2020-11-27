variable "region" {
  description = "This is the cloud hosting region where your webapp will be deployed."
}

variable "prefix" {
  description = "This is the environment where your webapp is deployed. qa, prod, or dev"
}

variable "ec2_ami" {
  type = string
}

variable "ec2_instance_type" {
  type = string
}

variable "vpc_name" {
  description = "Name of VPC"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "vpc_azs" {
  description = "Availability zones for VPC"
  type        = list
}

variable "vpc_create_database_subnet_group" {
  type = bool
}

variable "vpc_database_subnets" {
  type = list(string)
}

variable "vpc_database_subnet_suffix" {
  type = string
}

variable "vpc_private_subnets" {
  description = "Private subnets for VPC"
  type        = list(string)
}

variable "vpc_private_subnet_suffix" {
  type = string
}

variable "vpc_public_subnets" {
  description = "Public subnets for VPC"
  type        = list(string)
}

variable "vpc_public_subnet_suffix" {
  type = string
}

variable "vpc_enable_nat_gateway" {
  description = "Enable NAT gateway for VPC"
  type        = bool
}

variable "vpc_tags" {
  description = "Tags to apply to resources created by VPC module"
  type        = map(string)
}

variable "cognito_callback_urls" {
  description = "List of allowed callback URLs for the identity providers"
  type        = list(string)
}

variable "cognito_logout_urls" {
  description = "List of allowed callback URLs for the identity providers"
  type        = list(string)
}

variable "cognito_default_redirect_uri" {
  description = "The default redirect URI. Must be in the list of callback URLs"
  type        = string
}
