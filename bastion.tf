resource "aws_key_pair" "deployer" {
  key_name   = "james"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDZtoazUzJ5AlVkEgBoRlhild1Gk2O1XIfMx9dyT6IbpqeupJJeEGvHBg4kGBuCXbpwKPSljKr2Cp47zfZBHrxlXrqeUz5FUtOL+RDY+myXEqdADs6exa/iUqo0tYhv4KtLiV0ET6xs7JOKUCTFs2rGvBEUDYRs+aQbDZRzFZbp3Rh84unePZoVtc5HGW/JEJTh+WsQokNaRDk41bJZrXOadIwiOEtKMaeYTTDRFkCOVtYbnHMKIJNF0NO3/b4EMo9r5jLzGhGNFrpJc/eCZO/uZiuG6Qf9rCuU9jUDKv5KG1FqOVOLBA1i4uQOVO41lgMx+h4xTzGEjxtGYBKepesl"
}

resource "aws_security_group" "bastion" {
  name        = "bastion-server"
  vpc_id      = module.vpc_main.vpc_id
}

module "ec2_cluster" {
  source                 = "terraform-aws-modules/ec2-instance/aws"
  version                = "~> 2.0"

  name                   = "bastion"
  instance_count         = 1

  ami                    = "ami-0fc970315c2d38f01"
  instance_type          = "t2.micro"
  key_name               = "james"
  monitoring             = true
  vpc_security_group_ids = [aws_security_group.bastion.id]
  subnet_ids              = module.vpc_main.public_subnets

  tags = {
    Terraform   = "true"
    Environment = "dev"
  }
}

resource "aws_security_group_rule" "bastion_ssh_access" {
  type                     = "ingress"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
  security_group_id        = aws_security_group.bastion.id
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "bastion_aurora_access" {
  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.bastion.id
  source_security_group_id = module.aurora.this_security_group_id
}
