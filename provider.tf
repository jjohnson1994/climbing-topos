terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27.0"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = var.region
}

provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}
