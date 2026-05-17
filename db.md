enum UserRole {
  admin
  client
}

enum ClientStatus {
  active
  inactive
  prospect
  suspended
}

enum ProjectStatus {
  draft
  planning
  development
  testing
  live
  maintenance
  paused
  completed
  cancelled
}

enum ProjectPaymentModel {
  one_time
  subscription
  custom
}

enum ProjectLinkType {
  production
  staging
  repository
  admin_panel
  api
  database_panel
  hosting_panel
  figma
  documentation
  other
}

enum PaymentTimelineType {
  dp
  installment
  final_payment
  monthly_subscription
  yearly_subscription
  trial
  maintenance_fee
  domain_fee
  hosting_fee
  server_fee
  revision_fee
  feature_addition_fee
  custom
}

enum PaymentTimelineStatus {
  planned
  waiting
  partially_paid
  paid
  overdue
  cancelled
}

enum PaymentMethod {
  bank_transfer
  cash
  e_wallet
  payment_gateway
  other
}

enum MonitorStatus {
  online
  down
  slow
  warning
  paused
  unknown
}

enum HttpMethod {
  GET
  POST
  HEAD
}

enum IncidentStatus {
  ongoing
  resolved
}

enum IssuePriority {
  low
  medium
  high
  critical
}

enum IssueStatus {
  open
  in_progress
  need_review
  fixed
  closed
  rejected
}

enum MaintenanceStatus {
  planned
  in_progress
  completed
  cancelled
}

enum NotificationType {
  payment_due
  payment_overdue
  website_down
  website_recovered
  issue_created
  issue_updated
  domain_expired
  hosting_expired
  maintenance
}

enum NotificationChannel {
  dashboard
  email
  whatsapp
  telegram
}

Table clients {
  id bigint [pk, increment]

  company_name varchar(180)
  display_name varchar(180) [null]

  pic_name varchar(150) [null]
  pic_position varchar(100) [null]
  pic_email varchar(150) [null]
  pic_phone varchar(30) [null]
  pic_whatsapp varchar(30) [null]

  company_email varchar(150) [null]
  company_phone varchar(30) [null]

  address text [null]
  city varchar(100) [null]
  province varchar(100) [null]

  status ClientStatus [default: 'active']
  notes text [null]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp [null]

  indexes {
    company_name
    pic_name
    status
  }
}

Table users {
  id bigint [pk, increment]
  client_id bigint [null, ref: > clients.id]

  name varchar(150)
  email varchar(150) [unique]
  password varchar(255)

  role UserRole [default: 'admin']
  phone varchar(30) [null]
  avatar varchar(255) [null]
  is_active boolean [default: true]

  email_verified_at timestamp [null]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp [null]

  indexes {
    client_id
    role
    is_active
  }
}

Table projects {
  id bigint [pk, increment]
  client_id bigint [ref: > clients.id]

  name varchar(180)
  slug varchar(200) [unique]
  description text [null]

  project_type varchar(100)

  contract_value decimal(14,2) [default: 0]

  payment_model ProjectPaymentModel [default: 'custom']
  status ProjectStatus [default: 'draft']

  start_date date [null]
  target_finish_date date [null]
  live_date date [null]

  tech_stack text [null]
  internal_notes text [null]

  created_by bigint [ref: > users.id]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp [null]

  indexes {
    client_id
    project_type
    payment_model
    status
    created_by
  }
}

Table project_links {
  id bigint [pk, increment]
  project_id bigint [ref: > projects.id]

  type ProjectLinkType
  label varchar(150)
  url varchar(255)

  username varchar(150) [null]
  notes text [null]

  is_primary boolean [default: false]
  is_active boolean [default: true]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp [null]

  indexes {
    project_id
    type
    is_primary
    is_active
  }
}

Table project_members {
  id bigint [pk, increment]
  project_id bigint [ref: > projects.id]
  user_id bigint [ref: > users.id]

  role varchar(100) [null]
  assigned_at timestamp [null]

  created_at timestamp
  updated_at timestamp

  indexes {
    (project_id, user_id) [unique]
    project_id
    user_id
  }
}

Table project_payment_timelines {
  id bigint [pk, increment]
  project_id bigint [ref: > projects.id]
  client_id bigint [ref: > clients.id]

  type PaymentTimelineType

  title varchar(180)
  description text [null]

  sequence_order int [default: 1]

  percentage decimal(5,2) [null]

  planned_amount decimal(14,2) [default: 0]
  paid_amount decimal(14,2) [default: 0]
  remaining_amount decimal(14,2) [default: 0]

  due_date date [null]
  paid_at timestamp [null]

  billing_period_start date [null]
  billing_period_end date [null]

  status PaymentTimelineStatus [default: 'planned']

  payment_method PaymentMethod [null]
  reference_number varchar(150) [null]
  proof_file varchar(255) [null]

  reminder_days_before int [null]

  is_additional_charge boolean [default: false]

  admin_notes text [null]
  client_notes text [null]

  created_by bigint [ref: > users.id]
  updated_by bigint [null, ref: > users.id]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp [null]

  indexes {
    project_id
    client_id
    type
    status
    due_date
    paid_at
    is_additional_charge
    created_by
  }
}

Table website_monitors {
  id bigint [pk, increment]
  project_id bigint [ref: > projects.id]
  project_link_id bigint [null, ref: > project_links.id]

  name varchar(150)
  url varchar(255)
  method HttpMethod [default: 'GET']

  expected_status_code int [default: 200]
  timeout_seconds int [default: 10]
  check_interval_seconds int [default: 60]

  is_active boolean [default: true]

  current_status MonitorStatus [default: 'unknown']
  last_status_code int [null]
  last_response_time_ms int [null]
  last_checked_at timestamp [null]
  last_down_at timestamp [null]
  last_recovered_at timestamp [null]

  consecutive_failures int [default: 0]
  consecutive_successes int [default: 0]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp [null]

  indexes {
    project_id
    project_link_id
    is_active
    current_status
    last_checked_at
  }
}

Table website_check_logs {
  id bigint [pk, increment]
  monitor_id bigint [ref: > website_monitors.id]
  project_id bigint [ref: > projects.id]

  checked_at timestamp

  is_success boolean
  status MonitorStatus
  status_code int [null]
  response_time_ms int [null]

  error_type varchar(100) [null]
  error_message text [null]

  created_at timestamp

  indexes {
    monitor_id
    project_id
    checked_at
    status
    is_success
  }
}

Table website_incidents {
  id bigint [pk, increment]
  monitor_id bigint [ref: > website_monitors.id]
  project_id bigint [ref: > projects.id]

  started_at timestamp
  resolved_at timestamp [null]
  duration_seconds int [null]

  status IncidentStatus [default: 'ongoing']
  reason varchar(255) [null]

  first_error_message text [null]
  last_error_message text [null]

  created_at timestamp
  updated_at timestamp

  indexes {
    monitor_id
    project_id
    status
    started_at
    resolved_at
  }
}

Table issues {
  id bigint [pk, increment]
  project_id bigint [ref: > projects.id]
  client_id bigint [ref: > clients.id]

  title varchar(180)
  description text

  priority IssuePriority [default: 'medium']
  status IssueStatus [default: 'open']

  reported_by bigint [null, ref: > users.id]
  assigned_to bigint [null, ref: > users.id]

  due_date date [null]
  resolved_at timestamp [null]
  closed_at timestamp [null]

  resolution_notes text [null]
  internal_notes text [null]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp [null]

  indexes {
    project_id
    client_id
    priority
    status
    assigned_to
    reported_by
    due_date
  }
}

Table issue_attachments {
  id bigint [pk, increment]
  issue_id bigint [ref: > issues.id]
  uploaded_by bigint [ref: > users.id]

  file_name varchar(180)
  file_path varchar(255)
  file_type varchar(100) [null]
  file_size bigint [null]

  created_at timestamp
  updated_at timestamp

  indexes {
    issue_id
    uploaded_by
  }
}

Table maintenance_logs {
  id bigint [pk, increment]
  project_id bigint [ref: > projects.id]

  title varchar(180)
  description text

  status MaintenanceStatus [default: 'planned']

  scheduled_at timestamp [null]
  started_at timestamp [null]
  completed_at timestamp [null]

  handled_by bigint [null, ref: > users.id]
  duration_minutes int [null]

  notes text [null]

  created_at timestamp
  updated_at timestamp

  indexes {
    project_id
    status
    scheduled_at
    handled_by
  }
}

Table domain_assets {
  id bigint [pk, increment]
  client_id bigint [ref: > clients.id]
  project_id bigint [null, ref: > projects.id]

  domain_name varchar(180)
  registrar varchar(150) [null]

  registered_at date [null]
  expired_at date [null]

  auto_renew boolean [default: false]
  notes text [null]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp [null]

  indexes {
    client_id
    project_id
    domain_name
    expired_at
  }
}

Table hosting_assets {
  id bigint [pk, increment]
  client_id bigint [ref: > clients.id]
  project_id bigint [null, ref: > projects.id]

  provider varchar(150)
  service_name varchar(150) [null]
  panel_url varchar(255) [null]
  server_ip varchar(100) [null]

  start_date date [null]
  expired_at date [null]

  notes text [null]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp [null]

  indexes {
    client_id
    project_id
    provider
    expired_at
  }
}

Table notifications {
  id bigint [pk, increment]
  user_id bigint [null, ref: > users.id]
  client_id bigint [null, ref: > clients.id]
  project_id bigint [null, ref: > projects.id]

  related_type varchar(100) [null]
  related_id bigint [null]

  type NotificationType
  channel NotificationChannel [default: 'dashboard']

  title varchar(180)
  message text

  is_read boolean [default: false]
  read_at timestamp [null]

  action_url varchar(255) [null]

  created_at timestamp
  updated_at timestamp

  indexes {
    user_id
    client_id
    project_id
    type
    is_read
    created_at
  }
}