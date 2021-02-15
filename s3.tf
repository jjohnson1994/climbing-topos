resource "aws_s3_bucket" "deploy" {
  bucket = var.domain_name
  acl    = "public-read"

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket_policy" "deploy" {
  bucket = aws_s3_bucket.deploy.id

  policy = <<POLICY
{ 
  "Version": "2012-10-17",
  "Statement": [
      {
          "Sid": "PublicReadGetObject",
          "Effect": "Allow",
          "Principal": "*",
          "Action": [
              "s3:GetObject"
          ],
          "Resource": [
            "arn:aws:s3:::${var.domain_name}/*"
          ]
      }
  ]
}
POLICY
}

resource "aws_s3_bucket" "s3_images" {
  bucket = var.image_bucket_name
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = ["http://localhost:3000"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_policy" "s3_images" {
  bucket = aws_s3_bucket.s3_images.id
  policy = <<POLICY
{ 
  "Version": "2012-10-17",
  "Statement": [
      {
          "Sid": "PublicReadGetObject",
          "Effect": "Allow",
          "Principal": "*",
          "Action": [
              "s3:GetObject"
          ],
          "Resource": [
            "arn:aws:s3:::${var.image_bucket_name}/*"
          ]
      }
  ]
}
POLICY
}
