variable "app_name" {
  default = "climbingtopos"
}

variable "availability_zones" {
  default = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
}

variable "domain_name" {
  default = "climbingtopos.com"
}

variable "image_bucket_name" {
  default = "climbing-topos-images"
}

variable "region" {
  default = "eu-west-1"
}