resource "aws_s3_bucket" "b" {
  bucket = "yorkshire-climbing-images"
  acl    = "public-read"

  tags = {
    Name        = "images"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_policy" "b" {
  bucket = aws_s3_bucket.b.id
  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Action": "s3:GetObject",
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::yorkshire-climbing-images/*",
      "Principal": "*"
    }
  ]
}
POLICY
}
