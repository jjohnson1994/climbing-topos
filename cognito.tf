resource "aws_cognito_user_pool" "pool" {
  alias_attributes         = ["phone_number", "email", "preferred_username"]
  auto_verified_attributes = ["email"]
  mfa_configuration        = "OPTIONAL"
  name                     = "${var.prefix}_app_users"
  software_token_mfa_configuration {
    enabled = true
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "given_name"
    required                 = true
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "family_name"
    required                 = true
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "birthdate"
    required                 = true
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      min_length = 7
      max_length = 256
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "phone_number"
    required                 = true
  }

  password_policy {
    minimum_length    = 6
    require_lowercase = false
    require_numbers   = false
    require_symbols   = false
    require_uppercase = false
  }
}

resource "aws_cognito_user_pool_client" "client" {
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
  callback_urls                        = var.cognito_callback_urls
  default_redirect_uri                 = var.cognito_default_redirect_uri
  generate_secret                      = false
  logout_urls                          = var.cognito_logout_urls
  name                                 = "${var.prefix == "prod" ? "" : var.prefix}_yorkshire_climbing_pool_client"
  prevent_user_existence_errors        = "ENABLED"
  supported_identity_providers         = ["COGNITO"]
  user_pool_id                         = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.prefix == "prod" ? "" : "dev-"}yorkshire-climbing"
  user_pool_id = aws_cognito_user_pool.pool.id
}
