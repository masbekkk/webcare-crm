# PRD — Software House Project Management & Website Monitoring System

## 1. Informasi Dokumen

| Item | Keterangan |
|---|---|
| Nama Produk | Software House Project Management & Website Monitoring System |
| Jenis Produk | Web Application |
| Target Pengguna | Admin internal software house dan client |
| Tujuan Utama | Mengelola client, project, pembayaran, monitoring website, issue, maintenance, domain, hosting, dan notifikasi dalam satu sistem |
| Versi PRD | 1.0 |
| Status | Draft final berdasarkan rancangan database |
| Platform | Web responsive |
| Role Utama | Admin, Client |

---

## 2. Ringkasan Produk

Website ini adalah sistem manajemen project untuk software house yang berfungsi sebagai pusat pengelolaan data client, project website/aplikasi, pembayaran project, monitoring uptime website client, issue/bug tracking, maintenance log, domain, hosting, dan notifikasi.

Sistem ini dirancang agar software house dapat memantau seluruh project client dalam satu dashboard, termasuk status pembayaran, status website, bug yang sedang berjalan, serta aset penting seperti domain dan hosting.

Fokus utama sistem ini adalah:

1. Mencatat data client dan PIC utama.
2. Mencatat data project dan status pengerjaan.
3. Menyimpan berbagai link project secara fleksibel.
4. Mengelola pembayaran project secara fleksibel, baik beli putus maupun langganan.
5. Melakukan monitoring website client secara otomatis.
6. Mencatat histori website down dan recovered.
7. Mencatat issue/bug project.
8. Mencatat aktivitas maintenance.
9. Mengingatkan domain dan hosting yang akan expired.
10. Mengirim notifikasi internal kepada admin dan client.

---

## 3. Latar Belakang Masalah

Software house biasanya mengelola banyak client dan project secara bersamaan. Dalam praktiknya, data sering tersebar di banyak tempat seperti WhatsApp, spreadsheet, catatan pribadi, email, dan aplikasi task management yang terpisah.

Masalah utama yang sering muncul:

- Data client tidak terpusat.
- Sulit mengetahui project mana yang sedang development, testing, live, maintenance, paused, atau completed.
- Riwayat pembayaran project tidak rapi.
- Pembayaran DP, cicilan, closing, revisi, dan biaya tambahan sulit dilacak.
- Model langganan client bisa berubah nominal per bulan, tetapi tidak terdokumentasi dengan baik.
- Website client bisa down tanpa segera diketahui.
- Issue atau bug dari client sering tercecer di chat.
- Aktivitas maintenance tidak terdokumentasi.
- Domain dan hosting bisa expired karena tidak ada reminder.
- Client tidak punya portal untuk melihat status project atau melaporkan issue.

Sistem ini dibuat untuk menyelesaikan masalah tersebut dengan menyediakan satu platform internal yang terstruktur dan mudah digunakan.

---

## 4. Tujuan Produk

### 4.1 Tujuan Bisnis

- Membantu software house mengelola seluruh client dan project secara profesional.
- Mengurangi risiko lupa pembayaran, domain expired, hosting expired, dan website down.
- Meningkatkan kecepatan respons terhadap issue dan downtime.
- Memberikan transparansi kepada client melalui portal client.
- Membantu admin melihat kondisi bisnis dan operasional project dalam satu dashboard.

### 4.2 Tujuan Pengguna

#### Admin

Admin dapat:

- Melihat seluruh client dan project.
- Mengelola status project.
- Mengelola pembayaran project.
- Melihat pembayaran overdue.
- Melihat website yang down.
- Mencatat issue/bug.
- Mencatat maintenance.
- Mencatat domain dan hosting.
- Menerima notifikasi penting.

#### Client

Client dapat:

- Melihat daftar project miliknya.
- Melihat status project.
- Melihat status pembayaran.
- Melaporkan issue/bug.
- Melihat status issue.
- Melihat status website miliknya.
- Menerima notifikasi terkait project miliknya.

---

## 5. Target Pengguna

## 5.1 Admin

Admin adalah pengguna internal software house. Admin memiliki akses penuh terhadap seluruh data.

Admin dapat mengelola:

- Client
- User
- Project
- Project link
- Project member
- Payment timeline
- Website monitor
- Website check log
- Website incident
- Issue
- Issue attachment
- Maintenance log
- Domain asset
- Hosting asset
- Notification

## 5.2 Client

Client adalah user eksternal dari pihak pelanggan. Client hanya dapat melihat dan mengelola data yang terkait dengan `client_id` miliknya.

Client dapat:

- Melihat project miliknya.
- Melihat payment timeline miliknya.
- Melaporkan issue.
- Melihat issue miliknya.
- Melihat status website miliknya.
- Melihat notifikasi miliknya.

Client tidak dapat:

- Melihat data client lain.
- Mengakses dashboard admin.
- Mengubah nominal pembayaran.
- Mengubah status pembayaran.
- Melihat internal notes admin.
- Melihat project internal software house.
- Melihat data project client lain.

---

## 6. Scope Produk

## 6.1 In Scope

Fitur yang termasuk dalam scope:

1. Authentication dan authorization.
2. Admin dashboard.
3. Client management.
4. User management sederhana.
5. Project management.
6. Project link management.
7. Project member management.
8. Flexible payment timeline management.
9. Website monitoring.
10. Website check log.
11. Website incident tracking.
12. Issue management.
13. Issue attachment.
14. Maintenance log.
15. Domain asset management.
16. Hosting asset management.
17. Notification center.
18. Client portal.

## 6.2 Out of Scope untuk MVP

Fitur yang tidak wajib untuk MVP:

1. Payment gateway otomatis.
2. Invoice PDF otomatis.
3. Multi-company SaaS.
4. Advanced role permission.
5. Issue comment thread.
6. Advanced SLA reporting.
7. Auto-renew domain/hosting.
8. Integrasi GitHub/GitLab.
9. Integrasi WhatsApp gateway real-time.
10. Payment transaction detail per transfer.
11. Project milestone dan task management detail.
12. Password vault atau credential manager.

---

## 7. Role dan Hak Akses

## 7.1 Role Admin

Admin memiliki akses penuh.

| Modul | Akses Admin |
|---|---|
| Dashboard | View |
| Client | Create, Read, Update, Delete |
| User | Create, Read, Update, Delete |
| Project | Create, Read, Update, Delete |
| Project Links | Create, Read, Update, Delete |
| Project Members | Create, Read, Update, Delete |
| Payment Timeline | Create, Read, Update, Delete |
| Website Monitor | Create, Read, Update, Delete, Check Now |
| Website Logs | Read |
| Website Incidents | Read, Update |
| Issues | Create, Read, Update, Delete |
| Issue Attachments | Upload, Download, Delete |
| Maintenance Logs | Create, Read, Update, Delete |
| Domain Assets | Create, Read, Update, Delete |
| Hosting Assets | Create, Read, Update, Delete |
| Notifications | Read, Update |

## 7.2 Role Client

Client memiliki akses terbatas.

| Modul | Akses Client |
|---|---|
| Client Dashboard | View |
| My Projects | Read |
| My Payments | Read |
| My Issues | Create, Read |
| Issue Attachments | Upload, Download milik sendiri |
| Website Status | Read milik sendiri |
| Notifications | Read milik sendiri |
| Profile | Update data pribadi |

---

## 8. Modul Authentication

## 8.1 Deskripsi

Authentication digunakan untuk login dan logout user. User memiliki role `admin` atau `client`.

## 8.2 Functional Requirements

- User dapat login menggunakan email dan password.
- User dapat logout.
- Sistem menyimpan waktu login terakhir.
- User dengan `is_active = false` tidak boleh login.
- Role menentukan halaman awal setelah login.
- Admin diarahkan ke admin dashboard.
- Client diarahkan ke client dashboard.

## 8.3 Business Rules

- Email harus unik.
- Password harus di-hash.
- Client user wajib memiliki `client_id`.
- Admin user boleh memiliki `client_id = null`.
- User nonaktif tidak dapat login.

## 8.4 Acceptance Criteria

- User dapat login dengan kredensial valid.
- User tidak dapat login jika password salah.
- User tidak dapat login jika akun tidak aktif.
- Admin masuk ke dashboard admin.
- Client masuk ke portal client.

---

## 9. Admin Dashboard

## 9.1 Deskripsi

Dashboard admin menampilkan ringkasan kondisi bisnis dan teknis dari semua project.

## 9.2 Data yang Ditampilkan

Dashboard harus menampilkan:

- Total client.
- Total client aktif.
- Total client prospect.
- Total project.
- Total project development.
- Total project live.
- Total project maintenance.
- Total payment overdue.
- Total payment due dalam 7 hari.
- Total paid revenue bulan ini.
- Total remaining amount.
- Total website online.
- Total website down.
- Total website slow.
- Total issue open.
- Total issue critical.
- Domain yang akan expired.
- Hosting yang akan expired.
- Recent website incidents.
- Recent issues.
- Recent payment updates.

## 9.3 Widget Dashboard

### 9.3.1 Client Summary

Menampilkan jumlah client berdasarkan status:

- Active
- Inactive
- Prospect
- Suspended

### 9.3.2 Project Summary

Menampilkan jumlah project berdasarkan status:

- Draft
- Planning
- Development
- Testing
- Live
- Maintenance
- Paused
- Completed
- Cancelled

### 9.3.3 Payment Summary

Menampilkan ringkasan:

- Planned payment
- Waiting payment
- Partially paid
- Paid
- Overdue
- Cancelled

### 9.3.4 Monitoring Summary

Menampilkan jumlah monitor berdasarkan status:

- Online
- Down
- Slow
- Warning
- Paused
- Unknown

### 9.3.5 Issue Summary

Menampilkan jumlah issue berdasarkan:

- Priority
- Status
- Assignee

## 9.4 Acceptance Criteria

- Admin dapat melihat ringkasan utama dalam satu halaman.
- Data dashboard sesuai dengan database.
- Widget payment dapat menghitung total paid dan remaining.
- Widget monitoring menampilkan website down secara jelas.
- Widget issue critical tampil mencolok.

---

## 10. Client Management

## 10.1 Deskripsi

Modul client digunakan untuk mengelola data perusahaan client dan PIC utama.

## 10.2 Field Client

- Company Name
- Display Name
- PIC Name
- PIC Position
- PIC Email
- PIC Phone
- PIC WhatsApp
- Company Email
- Company Phone
- Address
- City
- Province
- Status
- Notes

## 10.3 Functional Requirements

Admin dapat:

- Membuat client baru.
- Mengedit client.
- Menghapus client secara soft delete.
- Melihat daftar client.
- Melihat detail client.
- Mencari client berdasarkan company name atau PIC name.
- Filter client berdasarkan status.
- Melihat daftar project milik client.
- Melihat daftar payment timeline milik client.
- Melihat domain dan hosting milik client.

## 10.4 Business Rules

- `company_name` wajib diisi.
- `status` default adalah `active`.
- PIC boleh kosong.
- Client yang sudah memiliki project tidak boleh dihapus permanen.
- Delete menggunakan soft delete.
- Client status `suspended` dapat digunakan jika client bermasalah secara pembayaran atau kontrak.

## 10.5 Acceptance Criteria

- Admin dapat membuat client baru.
- Admin dapat mengubah status client.
- Admin dapat melihat semua project milik client.
- Client yang dihapus tidak tampil di list utama.
- Data client dapat dicari dan difilter.

---

## 11. User Management

## 11.1 Deskripsi

Modul user digunakan untuk mengelola akun admin dan client.

## 11.2 Field User

- Client ID
- Name
- Email
- Password
- Role
- Phone
- Avatar
- Is Active
- Email Verified At
- Last Login At

## 11.3 Functional Requirements

Admin dapat:

- Membuat user admin.
- Membuat user client.
- Menghubungkan user client ke client.
- Mengaktifkan/nonaktifkan user.
- Mengubah password user.
- Mengubah role user.
- Melihat last login user.

## 11.4 Business Rules

- Email harus unik.
- User role `client` wajib memiliki `client_id`.
- User role `admin` tidak wajib memiliki `client_id`.
- Password harus di-hash.
- User nonaktif tidak dapat login.

## 11.5 Acceptance Criteria

- Admin dapat membuat akun client.
- Client user hanya dapat melihat data sesuai `client_id`.
- User nonaktif tidak bisa login.
- Email duplikat ditolak.

---

## 12. Project Management

## 12.1 Deskripsi

Modul project digunakan untuk mencatat project website/aplikasi yang dikerjakan oleh software house.

## 12.2 Field Project

- Client ID
- Name
- Slug
- Description
- Project Type
- Contract Value
- Payment Model
- Status
- Start Date
- Target Finish Date
- Live Date
- Tech Stack
- Internal Notes
- Created By

## 12.3 Functional Requirements

Admin dapat:

- Membuat project baru.
- Mengedit project.
- Menghapus project secara soft delete.
- Melihat daftar project.
- Filter project berdasarkan client.
- Filter project berdasarkan project type.
- Filter project berdasarkan payment model.
- Filter project berdasarkan status.
- Melihat detail project.
- Mengubah status project.
- Mengisi contract value.
- Mengisi tech stack.
- Mengisi internal notes.

Client dapat:

- Melihat project miliknya.
- Melihat status project.
- Melihat deskripsi project.
- Melihat tanggal project.
- Melihat informasi terbatas yang tidak bersifat internal.

## 12.4 Project Type

Karena `project_type` berupa varchar, frontend harus menggunakan dropdown untuk menjaga konsistensi data.

Contoh pilihan:

- Company Profile
- E-Commerce
- ERP
- CRM
- POS
- Rental System
- Booking System
- LMS
- Marketplace
- Landing Page
- Custom Web App

## 12.5 Project Status

Status project:

- Draft
- Planning
- Development
- Testing
- Live
- Maintenance
- Paused
- Completed
- Cancelled

## 12.6 Payment Model

Payment model:

- `one_time`: beli putus.
- `subscription`: langganan.
- `custom`: pembayaran fleksibel/custom.

## 12.7 Business Rules

- Project wajib memiliki client.
- Project wajib memiliki nama.
- Slug harus unik.
- `contract_value` adalah nilai kontrak awal project.
- `contract_value` dapat bernilai 0 untuk project subscription.
- `internal_notes` hanya dapat dilihat admin.
- Client hanya dapat melihat project miliknya.
- Project yang sudah memiliki data pembayaran/issue/monitor tidak boleh hard delete.

## 12.8 Acceptance Criteria

- Admin dapat membuat project untuk client tertentu.
- Admin dapat mengubah status project.
- Admin dapat mengisi contract value.
- Client tidak dapat melihat internal notes.
- Project detail menampilkan links, payment timelines, monitor, issue, maintenance, domain, dan hosting.

---

## 13. Project Links

## 13.1 Deskripsi

Project links digunakan untuk menyimpan berbagai link penting terkait project secara fleksibel.

## 13.2 Link Type

- Production
- Staging
- Repository
- Admin Panel
- API
- Database Panel
- Hosting Panel
- Figma
- Documentation
- Other

## 13.3 Field Project Link

- Project ID
- Type
- Label
- URL
- Username
- Notes
- Is Primary
- Is Active

## 13.4 Functional Requirements

Admin dapat:

- Menambah link project.
- Mengedit link project.
- Menghapus link project.
- Menandai link sebagai primary.
- Mengaktifkan/nonaktifkan link.
- Menyimpan link production.
- Menyimpan link staging.
- Menyimpan link repository.
- Menyimpan link admin panel.
- Menyimpan link documentation.

Client dapat:

- Melihat link tertentu jika diizinkan oleh aplikasi.
- Secara default client sebaiknya hanya melihat production link dan documentation link.

## 13.5 Business Rules

- Link wajib memiliki project.
- Type wajib dipilih.
- Label wajib diisi.
- URL wajib valid.
- Password tidak boleh disimpan di field notes maupun username.
- Field username hanya digunakan untuk informasi non-sensitif.
- Hanya link aktif yang tampil di halaman detail utama.

## 13.6 Acceptance Criteria

- Satu project dapat memiliki banyak link.
- Admin dapat melihat semua link project.
- Client hanya melihat link yang aman ditampilkan.
- Link nonaktif tidak tampil di list utama.

---

## 14. Project Members

## 14.1 Deskripsi

Project members digunakan untuk mencatat anggota internal yang terlibat dalam project.

## 14.2 Field Project Member

- Project ID
- User ID
- Role
- Assigned At

## 14.3 Functional Requirements

Admin dapat:

- Menambahkan user ke project.
- Menghapus user dari project.
- Mengubah role user dalam project.
- Melihat daftar anggota project.

## 14.4 Business Rules

- Kombinasi `project_id` dan `user_id` harus unik.
- Role member dapat berupa teks seperti Backend Developer, Frontend Developer, Project Manager, Support, atau QA.
- Hanya user aktif yang dapat ditambahkan sebagai project member.

## 14.5 Acceptance Criteria

- User yang sama tidak bisa ditambahkan dua kali ke project yang sama.
- Project detail menampilkan anggota project.
- Role project member dapat diedit.

---

## 15. Payment Timeline Management

## 15.1 Deskripsi

Payment timeline adalah modul untuk mengelola rencana pembayaran, status pembayaran, dan histori pembayaran project secara fleksibel.

Modul ini menggantikan konsep invoice formal agar lebih cocok untuk operasional software house yang sering menggunakan model pembayaran berbeda-beda.

## 15.2 Field Payment Timeline

- Project ID
- Client ID
- Type
- Title
- Description
- Sequence Order
- Percentage
- Planned Amount
- Paid Amount
- Remaining Amount
- Due Date
- Paid At
- Billing Period Start
- Billing Period End
- Status
- Payment Method
- Reference Number
- Proof File
- Reminder Days Before
- Is Additional Charge
- Admin Notes
- Client Notes
- Created By
- Updated By

## 15.3 Payment Timeline Type

Jenis payment timeline:

- `dp`
- `installment`
- `final_payment`
- `monthly_subscription`
- `yearly_subscription`
- `trial`
- `maintenance_fee`
- `domain_fee`
- `hosting_fee`
- `server_fee`
- `revision_fee`
- `feature_addition_fee`
- `custom`

## 15.4 Payment Timeline Status

Status pembayaran:

- `planned`
- `waiting`
- `partially_paid`
- `paid`
- `overdue`
- `cancelled`

## 15.5 Payment Method

Metode pembayaran:

- `bank_transfer`
- `cash`
- `e_wallet`
- `payment_gateway`
- `other`

## 15.6 Functional Requirements Admin

Admin dapat:

- Menambah payment timeline.
- Mengedit payment timeline.
- Menghapus payment timeline.
- Mengatur urutan pembayaran.
- Mengisi persentase pembayaran.
- Mengisi planned amount.
- Mengisi paid amount.
- Mengisi due date.
- Mengisi paid at.
- Mengisi billing period.
- Mengubah status pembayaran.
- Mengisi metode pembayaran.
- Upload bukti pembayaran.
- Menulis admin notes.
- Menulis client notes.
- Menandai biaya tambahan.
- Melihat total planned amount.
- Melihat total paid amount.
- Melihat total remaining amount.
- Melihat pembayaran overdue.
- Melihat pembayaran jatuh tempo dalam 7 hari.

## 15.7 Functional Requirements Client

Client dapat:

- Melihat payment timeline project miliknya.
- Melihat status pembayaran.
- Melihat nominal tagihan.
- Melihat due date.
- Melihat periode billing.
- Melihat client notes.
- Melihat proof file jika diizinkan.

Client tidak dapat:

- Mengubah nominal pembayaran.
- Mengubah status pembayaran.
- Menghapus data pembayaran.
- Melihat admin notes.
- Mengubah payment method.
- Mengubah proof file.

## 15.8 Business Rules Payment

### 15.8.1 Planned Amount

`planned_amount` adalah nominal untuk satu baris timeline pembayaran, bukan harga total website.

Contoh:

- DP 30% = Rp3.000.000
- DP 50% = Rp5.000.000
- Closing 20% = Rp2.000.000

Total project awal disimpan di `projects.contract_value`.

### 15.8.2 Paid Amount

`paid_amount` adalah nominal yang sudah dibayar pada timeline tersebut.

### 15.8.3 Remaining Amount

`remaining_amount` dihitung dari:

```txt
remaining_amount = planned_amount - paid_amount
```

### 15.8.4 Due Date

- `due_date` boleh kosong.
- Jika due date kosong dan belum dibayar, status dapat berupa `waiting`.
- Jika due date tersedia dan sudah lewat, status menjadi `overdue`.
- Reminder hanya dihitung jika due date tersedia.

### 15.8.5 Percentage

- Digunakan untuk pembayaran berbasis persentase.
- Contoh: DP 30%, DP 50%, closing 20%.
- Jika tidak berbasis persentase, nilai boleh kosong.

### 15.8.6 Additional Charge

`is_additional_charge = true` digunakan untuk:

- Tambahan revisi.
- Tambahan fitur.
- Tambahan server.
- Biaya maintenance.
- Biaya domain.
- Biaya hosting.
- Biaya custom lain.

### 15.8.7 Status Otomatis

Sistem dapat menerapkan rule:

```txt
Jika paid_amount = 0 dan due_date null -> waiting
Jika paid_amount = 0 dan due_date belum lewat -> planned
Jika paid_amount = 0 dan due_date sudah lewat -> overdue
Jika paid_amount > 0 dan paid_amount < planned_amount -> partially_paid
Jika paid_amount >= planned_amount -> paid
```

## 15.9 Contoh Beli Putus

Project:

- Nama: Website E-Commerce
- Contract Value: Rp10.000.000
- Payment Model: one_time

| Type | Title | Percentage | Planned Amount | Paid Amount | Remaining | Status | Additional |
|---|---|---:|---:|---:|---:|---|---|
| dp | DP 30% | 30 | 3.000.000 | 3.000.000 | 0 | paid | false |
| installment | DP 50% | 50 | 5.000.000 | 0 | 5.000.000 | planned | false |
| final_payment | Closing 20% | 20 | 2.000.000 | 0 | 2.000.000 | waiting | false |

Jika ada tambahan revisi:

| Type | Title | Planned Amount | Status | Additional |
|---|---|---:|---|---|
| revision_fee | Tambahan Revisi Checkout | 1.500.000 | planned | true |

Jika ada tambahan server:

| Type | Title | Planned Amount | Status | Additional |
|---|---|---:|---|---|
| server_fee | Upgrade Server VPS | 800.000 | planned | true |

## 15.10 Contoh Langganan

Project:

- Nama: Maintenance Website
- Payment Model: subscription
- Free trial: 1 bulan
- Bulan 1-3: Rp500.000/bulan
- Bulan 4-8: Rp900.000/bulan

| Type | Title | Billing Start | Billing End | Planned Amount | Paid Amount | Status |
|---|---|---|---|---:|---:|---|
| trial | Free Trial Januari | 2026-01-01 | 2026-01-31 | 0 | 0 | paid |
| monthly_subscription | Langganan Februari | 2026-02-01 | 2026-02-28 | 500.000 | 500.000 | paid |
| monthly_subscription | Langganan Maret | 2026-03-01 | 2026-03-31 | 500.000 | 0 | planned |
| monthly_subscription | Langganan April | 2026-04-01 | 2026-04-30 | 500.000 | 0 | planned |
| monthly_subscription | Langganan Mei | 2026-05-01 | 2026-05-31 | 900.000 | 0 | planned |

## 15.11 Acceptance Criteria

- Admin dapat membuat payment timeline dengan due date atau tanpa due date.
- Admin dapat membuat trial dengan planned amount 0.
- Admin dapat mencatat DP berbasis persentase.
- Admin dapat mencatat biaya tambahan.
- Sistem menghitung remaining amount.
- Sistem menampilkan pembayaran overdue.
- Client dapat melihat payment timeline miliknya.
- Client tidak dapat melihat admin notes.

---

## 16. Website Monitoring

## 16.1 Deskripsi

Website monitoring digunakan untuk mengecek apakah website client online, down, slow, warning, paused, atau unknown.

## 16.2 Field Website Monitor

- Project ID
- Project Link ID
- Name
- URL
- Method
- Expected Status Code
- Timeout Seconds
- Check Interval Seconds
- Is Active
- Current Status
- Last Status Code
- Last Response Time
- Last Checked At
- Last Down At
- Last Recovered At
- Consecutive Failures
- Consecutive Successes

## 16.3 Functional Requirements

Admin dapat:

- Membuat website monitor.
- Mengedit website monitor.
- Menghapus website monitor.
- Menghubungkan monitor dengan project link.
- Mengatur URL yang dimonitor.
- Mengatur HTTP method.
- Mengatur expected status code.
- Mengatur timeout.
- Mengatur check interval.
- Mengaktifkan/nonaktifkan monitor.
- Melakukan check manual.
- Melihat status monitor.
- Melihat response time terakhir.
- Melihat last down dan last recovered.

## 16.4 Business Rules

- Default method adalah `GET`.
- Default expected status code adalah `200`.
- Default timeout adalah 10 detik.
- Default interval check adalah 60 detik.
- Monitor hanya berjalan jika `is_active = true`.
- Jika monitor tidak aktif, status dapat menjadi `paused`.
- Jika request sukses dan status code sesuai, status menjadi `online`.
- Jika response lambat melebihi threshold, status menjadi `slow`.
- Jika request gagal, status sementara menjadi `warning`.
- Jika gagal beberapa kali berturut-turut, status menjadi `down`.

## 16.5 False Alarm Prevention

Gunakan rule:

```txt
1 kali gagal -> warning
3 kali gagal berturut-turut -> down
2 kali sukses berturut-turut setelah down -> recovered
```

## 16.6 Acceptance Criteria

- Sistem dapat menjalankan monitoring otomatis setiap 1 menit.
- Setiap hasil check disimpan ke website check logs.
- Status monitor diperbarui otomatis.
- Incident dibuat ketika website down.
- Incident ditutup ketika website recovered.
- Notifikasi dibuat ketika website down dan recovered.

---

## 17. Website Check Logs

## 17.1 Deskripsi

Website check logs menyimpan hasil pengecekan website setiap kali monitor dijalankan.

## 17.2 Field Website Check Log

- Monitor ID
- Project ID
- Checked At
- Is Success
- Status
- Status Code
- Response Time MS
- Error Type
- Error Message

## 17.3 Functional Requirements

Admin dapat:

- Melihat daftar log per monitor.
- Filter log berdasarkan tanggal.
- Filter log berdasarkan status.
- Melihat response time.
- Melihat error type dan error message.

## 17.4 Business Rules

- Setiap check harus menghasilkan satu log.
- Response body HTML tidak perlu disimpan.
- Error message harus singkat.
- Log harus menggunakan pagination.
- Log lama dapat dibersihkan dengan retention policy.

## 17.5 Acceptance Criteria

- Log tersimpan setiap kali monitor berjalan.
- Admin dapat melihat histori monitoring.
- Admin dapat filter log berdasarkan tanggal.
- Log error menampilkan alasan kegagalan.

---

## 18. Website Incidents

## 18.1 Deskripsi

Website incidents menyimpan kejadian downtime secara ringkas.

## 18.2 Field Website Incident

- Monitor ID
- Project ID
- Started At
- Resolved At
- Duration Seconds
- Status
- Reason
- First Error Message
- Last Error Message

## 18.3 Functional Requirements

Sistem dapat:

- Membuat incident ketika website down.
- Menandai incident sebagai ongoing.
- Memperbarui last error message ketika masih down.
- Menutup incident ketika website recovered.
- Menghitung durasi downtime.
- Menampilkan incident per project.

## 18.4 Business Rules

- Satu monitor hanya boleh memiliki satu incident ongoing dalam satu waktu.
- Jika monitor down dan belum ada incident ongoing, sistem membuat incident baru.
- Jika monitor masih down, sistem memperbarui last error message.
- Jika monitor recovered, sistem mengisi resolved at, duration seconds, dan status resolved.

## 18.5 Acceptance Criteria

- Incident dibuat saat monitor down.
- Incident resolved saat website kembali online.
- Duration seconds dihitung otomatis.
- Notifikasi website recovered dibuat setelah incident resolved.

---

## 19. Issue Management

## 19.1 Deskripsi

Issue management digunakan untuk mencatat bug, error, request perbaikan, atau masalah pada project client.

## 19.2 Field Issue

- Project ID
- Client ID
- Title
- Description
- Priority
- Status
- Reported By
- Assigned To
- Due Date
- Resolved At
- Closed At
- Resolution Notes
- Internal Notes

## 19.3 Functional Requirements Admin

Admin dapat:

- Membuat issue.
- Mengedit issue.
- Menghapus issue.
- Mengubah priority.
- Mengubah status.
- Assign issue ke user.
- Menambahkan due date.
- Mengisi resolution notes.
- Mengisi internal notes.
- Melihat attachment issue.
- Upload attachment issue.

## 19.4 Functional Requirements Client

Client dapat:

- Membuat issue untuk project miliknya.
- Melihat issue miliknya.
- Upload screenshot atau file pendukung.
- Melihat status issue.
- Melihat resolution notes jika issue selesai.

Client tidak dapat:

- Melihat internal notes.
- Assign issue ke user internal.
- Menghapus issue yang sudah diproses.
- Melihat issue client lain.

## 19.5 Issue Priority

- Low
- Medium
- High
- Critical

## 19.6 Issue Status

- Open
- In Progress
- Need Review
- Fixed
- Closed
- Rejected

## 19.7 Business Rules

- Issue wajib terkait project.
- Issue wajib terkait client.
- Client hanya boleh membuat issue pada project miliknya.
- Internal notes hanya terlihat admin.
- Closed at diisi saat status menjadi closed.
- Resolved at diisi saat status menjadi fixed atau closed.

## 19.8 Acceptance Criteria

- Admin dapat melihat semua issue.
- Client hanya melihat issue miliknya.
- Issue dapat difilter berdasarkan project, status, priority, assignee, dan due date.
- Issue critical tampil di dashboard.
- Issue dapat memiliki attachment.

---

## 20. Issue Attachments

## 20.1 Deskripsi

Issue attachments digunakan untuk menyimpan file pendukung issue seperti screenshot, video, dokumen, atau log error.

## 20.2 Field Issue Attachment

- Issue ID
- Uploaded By
- File Name
- File Path
- File Type
- File Size

## 20.3 Functional Requirements

- User dapat upload attachment saat membuat issue.
- Admin dapat upload attachment ke issue.
- Admin dapat melihat attachment.
- Client dapat melihat attachment dari issue miliknya.
- Admin dapat menghapus attachment.

## 20.4 Business Rules

- Attachment wajib terkait issue.
- File disimpan di storage.
- Database hanya menyimpan path file.
- File size harus dibatasi.
- File type harus divalidasi.
- Client hanya dapat mengakses attachment dari issue miliknya.

## 20.5 Acceptance Criteria

- User dapat upload attachment.
- File tersimpan di storage.
- Path file tersimpan di database.
- Attachment dapat didownload oleh user yang berhak.

---

## 21. Maintenance Logs

## 21.1 Deskripsi

Maintenance logs digunakan untuk mencatat aktivitas maintenance pada project.

## 21.2 Field Maintenance Log

- Project ID
- Title
- Description
- Status
- Scheduled At
- Started At
- Completed At
- Handled By
- Duration Minutes
- Notes

## 21.3 Functional Requirements

Admin dapat:

- Membuat maintenance log.
- Mengedit maintenance log.
- Menghapus maintenance log.
- Mengubah status maintenance.
- Mengisi jadwal maintenance.
- Mengisi waktu mulai.
- Mengisi waktu selesai.
- Mengisi handler.
- Melihat histori maintenance per project.

## 21.4 Maintenance Status

- Planned
- In Progress
- Completed
- Cancelled

## 21.5 Business Rules

- Maintenance wajib terkait project.
- Started at diisi saat maintenance dimulai.
- Completed at diisi saat maintenance selesai.
- Duration minutes dapat dihitung dari started at dan completed at.
- Notes dapat berisi catatan hasil maintenance.

## 21.6 Acceptance Criteria

- Admin dapat membuat maintenance log.
- Admin dapat mengubah status maintenance.
- Maintenance terjadwal tampil di dashboard.
- Histori maintenance tampil di detail project.

---

## 22. Domain Assets

## 22.1 Deskripsi

Domain assets digunakan untuk mencatat domain milik client atau project.

## 22.2 Field Domain Asset

- Client ID
- Project ID
- Domain Name
- Registrar
- Registered At
- Expired At
- Auto Renew
- Notes

## 22.3 Functional Requirements

Admin dapat:

- Menambah domain.
- Mengedit domain.
- Menghapus domain.
- Menghubungkan domain ke client.
- Menghubungkan domain ke project.
- Melihat domain yang akan expired.
- Menandai auto renew.

## 22.4 Business Rules

- Domain wajib memiliki client.
- Project boleh kosong.
- Reminder dibuat jika expired at mendekati tanggal tertentu.
- Domain expired harus tampil di dashboard.
- Domain yang auto renew tetap perlu ditampilkan sebagai informasi.

## 22.5 Acceptance Criteria

- Admin dapat melihat daftar domain.
- Admin dapat filter domain berdasarkan client.
- Admin dapat filter domain berdasarkan expired date.
- Sistem dapat membuat notifikasi domain expired.

---

## 23. Hosting Assets

## 23.1 Deskripsi

Hosting assets digunakan untuk mencatat hosting, VPS, server, panel, atau layanan infrastruktur client.

## 23.2 Field Hosting Asset

- Client ID
- Project ID
- Provider
- Service Name
- Panel URL
- Server IP
- Start Date
- Expired At
- Notes

## 23.3 Functional Requirements

Admin dapat:

- Menambah hosting.
- Mengedit hosting.
- Menghapus hosting.
- Menyimpan provider.
- Menyimpan service name.
- Menyimpan panel URL.
- Menyimpan server IP.
- Menyimpan expired date.
- Melihat hosting yang akan expired.

## 23.4 Business Rules

- Hosting wajib memiliki client.
- Project boleh kosong.
- Reminder dibuat jika expired at mendekati tanggal tertentu.
- Password hosting tidak boleh disimpan dalam sistem ini.

## 23.5 Acceptance Criteria

- Admin dapat melihat daftar hosting.
- Admin dapat filter hosting berdasarkan client.
- Admin dapat filter hosting berdasarkan provider.
- Admin dapat filter hosting berdasarkan expired date.
- Sistem dapat membuat notifikasi hosting expired.

---

## 24. Notification Center

## 24.1 Deskripsi

Notification center digunakan untuk menyimpan dan menampilkan notifikasi sistem.

## 24.2 Field Notification

- User ID
- Client ID
- Project ID
- Related Type
- Related ID
- Type
- Channel
- Title
- Message
- Is Read
- Read At
- Action URL

## 24.3 Notification Type

- Payment Due
- Payment Overdue
- Website Down
- Website Recovered
- Issue Created
- Issue Updated
- Domain Expired
- Hosting Expired
- Maintenance

## 24.4 Notification Channel

- Dashboard
- Email
- WhatsApp
- Telegram

## 24.5 Functional Requirements

User dapat:

- Melihat daftar notifikasi.
- Melihat detail notifikasi.
- Menandai notifikasi sebagai read.
- Membuka action URL.
- Filter notifikasi berdasarkan type.

Sistem dapat membuat notifikasi untuk:

- Payment due.
- Payment overdue.
- Website down.
- Website recovered.
- Issue created.
- Issue updated.
- Domain expired.
- Hosting expired.
- Maintenance.

## 24.6 Business Rules

- Dashboard notification selalu disimpan di database.
- Related type dan related ID digunakan untuk menghubungkan notifikasi ke data sumber.
- Jika notifikasi untuk user tertentu, isi user ID.
- Jika notifikasi untuk client tertentu, isi client ID.
- Jika notifikasi terkait project, isi project ID.
- Is read default false.
- Read at diisi ketika notifikasi dibaca.

## 24.7 Acceptance Criteria

- Sistem membuat notifikasi saat payment overdue.
- Sistem membuat notifikasi saat website down.
- Sistem membuat notifikasi saat website recovered.
- Sistem membuat notifikasi saat issue dibuat.
- User dapat menandai notifikasi sebagai read.
- Action URL mengarah ke halaman terkait.

---

## 25. Client Portal

## 25.1 Deskripsi

Client portal adalah halaman khusus untuk client agar dapat melihat informasi project miliknya.

## 25.2 Fitur Client Portal

Client dapat:

- Login.
- Melihat client dashboard.
- Melihat daftar project miliknya.
- Melihat detail project.
- Melihat status project.
- Melihat payment timeline.
- Melihat status pembayaran.
- Membuat issue.
- Upload attachment issue.
- Melihat status issue.
- Melihat status website.
- Melihat notifikasi.

## 25.3 Data yang Disembunyikan dari Client

Client tidak boleh melihat:

- Internal notes project.
- Admin notes payment.
- Project client lain.
- Issue client lain.
- Data user internal.
- Repository link jika tidak diizinkan.
- Hosting panel jika tidak diizinkan.
- Database panel jika tidak diizinkan.
- Username internal jika sensitif.

## 25.4 Acceptance Criteria

- Client hanya melihat data berdasarkan client ID.
- Client dapat membuat issue.
- Client dapat melihat payment timeline miliknya.
- Client dapat melihat website status miliknya.
- Client tidak dapat mengakses dashboard admin.

---

## 26. Workflow Utama

## 26.1 Workflow Input Client dan Project

```txt
Admin login
↓
Admin membuat client
↓
Admin membuat project
↓
Admin memilih payment model
↓
Admin mengisi contract value
↓
Admin menambahkan project links
↓
Admin menambahkan payment timeline
↓
Admin membuat website monitor
↓
Project tampil di dashboard
```

## 26.2 Workflow Beli Putus

```txt
Admin membuat project dengan payment_model = one_time
↓
Admin mengisi contract_value
↓
Admin membuat timeline DP 30%
↓
Admin membuat timeline DP 50%
↓
Admin membuat timeline closing 20%
↓
Jika ada tambahan revisi/server/fitur, admin menambah payment timeline baru
↓
Admin update paid_amount dan status saat pembayaran masuk
```

## 26.3 Workflow Langganan

```txt
Admin membuat project dengan payment_model = subscription
↓
Admin membuat timeline trial jika ada
↓
Admin membuat timeline bulanan
↓
Admin mengubah nominal bulan tertentu jika ada tambahan fitur/server
↓
Sistem memberi reminder sebelum due date
↓
Admin update status menjadi paid saat pembayaran masuk
```

## 26.4 Workflow Monitoring Website

```txt
Scheduler berjalan setiap 1 menit
↓
Sistem mengambil website monitor aktif
↓
Sistem melakukan HTTP request ke URL
↓
Sistem menyimpan website check log
↓
Sistem update current status monitor
↓
Jika gagal berturut-turut, sistem membuat incident
↓
Sistem membuat notifikasi website down
↓
Jika normal kembali, sistem menutup incident
↓
Sistem membuat notifikasi website recovered
```

## 26.5 Workflow Issue

```txt
Client/Admin membuat issue
↓
Issue berstatus open
↓
Admin assign issue ke user
↓
Status berubah menjadi in_progress
↓
Jika sudah diperbaiki, status need_review atau fixed
↓
Jika selesai, status closed
```

## 26.6 Workflow Domain/Hosting Reminder

```txt
Sistem mengecek expired_at domain/hosting
↓
Jika mendekati expired date, sistem membuat notifikasi
↓
Admin memperpanjang domain/hosting
↓
Admin update expired_at baru
```

---

## 27. Halaman yang Dibutuhkan

## 27.1 Admin Pages

1. Login
2. Dashboard
3. Client List
4. Client Create
5. Client Edit
6. Client Detail
7. User List
8. User Create
9. User Edit
10. Project List
11. Project Create
12. Project Edit
13. Project Detail
14. Project Links
15. Project Members
16. Payment Timeline List
17. Payment Timeline Create
18. Payment Timeline Edit
19. Website Monitor List
20. Website Monitor Create
21. Website Monitor Edit
22. Website Monitor Detail
23. Website Check Logs
24. Website Incidents
25. Issue List
26. Issue Create
27. Issue Edit
28. Issue Detail
29. Maintenance Log List
30. Maintenance Log Create
31. Maintenance Log Edit
32. Domain Asset List
33. Domain Asset Create
34. Domain Asset Edit
35. Hosting Asset List
36. Hosting Asset Create
37. Hosting Asset Edit
38. Notification List
39. Profile Settings

## 27.2 Client Pages

1. Client Login
2. Client Dashboard
3. My Projects
4. Project Detail
5. My Payments
6. My Issues
7. Create Issue
8. Issue Detail
9. Website Status
10. Notifications
11. Profile Settings

---

## 28. API Endpoint Rekomendasi

## 28.1 Auth

```txt
POST /login
POST /logout
GET /me
```

## 28.2 Admin Clients

```txt
GET /admin/clients
POST /admin/clients
GET /admin/clients/{id}
PUT /admin/clients/{id}
DELETE /admin/clients/{id}
```

## 28.3 Admin Users

```txt
GET /admin/users
POST /admin/users
GET /admin/users/{id}
PUT /admin/users/{id}
DELETE /admin/users/{id}
```

## 28.4 Admin Projects

```txt
GET /admin/projects
POST /admin/projects
GET /admin/projects/{id}
PUT /admin/projects/{id}
DELETE /admin/projects/{id}
```

## 28.5 Admin Project Links

```txt
GET /admin/projects/{project}/links
POST /admin/projects/{project}/links
PUT /admin/project-links/{id}
DELETE /admin/project-links/{id}
```

## 28.6 Admin Project Members

```txt
GET /admin/projects/{project}/members
POST /admin/projects/{project}/members
PUT /admin/project-members/{id}
DELETE /admin/project-members/{id}
```

## 28.7 Admin Payment Timelines

```txt
GET /admin/projects/{project}/payment-timelines
POST /admin/projects/{project}/payment-timelines
PUT /admin/payment-timelines/{id}
DELETE /admin/payment-timelines/{id}
PATCH /admin/payment-timelines/{id}/mark-paid
PATCH /admin/payment-timelines/{id}/mark-overdue
```

## 28.8 Admin Website Monitors

```txt
GET /admin/projects/{project}/monitors
POST /admin/projects/{project}/monitors
GET /admin/monitors/{id}
PUT /admin/monitors/{id}
DELETE /admin/monitors/{id}
POST /admin/monitors/{id}/check-now
```

## 28.9 Admin Issues

```txt
GET /admin/issues
POST /admin/issues
GET /admin/issues/{id}
PUT /admin/issues/{id}
DELETE /admin/issues/{id}
POST /admin/issues/{id}/attachments
```

## 28.10 Admin Maintenance Logs

```txt
GET /admin/projects/{project}/maintenance-logs
POST /admin/projects/{project}/maintenance-logs
PUT /admin/maintenance-logs/{id}
DELETE /admin/maintenance-logs/{id}
```

## 28.11 Admin Domain Assets

```txt
GET /admin/domain-assets
POST /admin/domain-assets
PUT /admin/domain-assets/{id}
DELETE /admin/domain-assets/{id}
```

## 28.12 Admin Hosting Assets

```txt
GET /admin/hosting-assets
POST /admin/hosting-assets
PUT /admin/hosting-assets/{id}
DELETE /admin/hosting-assets/{id}
```

## 28.13 Client Portal

```txt
GET /client/projects
GET /client/projects/{id}
GET /client/payments
GET /client/issues
POST /client/issues
GET /client/issues/{id}
POST /client/issues/{id}/attachments
GET /client/website-status
GET /client/notifications
PATCH /client/notifications/{id}/read
```

---

## 29. Non-Functional Requirements

## 29.1 Performance

- Dashboard harus load kurang dari 3 detik untuk data normal.
- List page harus menggunakan pagination.
- Website check logs harus difilter berdasarkan tanggal.
- Query monitoring harus menggunakan index.
- Website check logs harus memiliki strategi retention.
- Upload file harus dibatasi ukuran maksimal.

## 29.2 Security

- Password wajib di-hash.
- Client hanya dapat mengakses data miliknya.
- Admin notes tidak boleh tampil di client portal.
- Internal notes tidak boleh tampil di client portal.
- Jangan menyimpan password hosting, database, server, atau cPanel di plaintext.
- File upload harus divalidasi berdasarkan extension dan MIME type.
- Semua route admin harus dilindungi middleware admin.
- Semua route client harus dilindungi middleware client.
- Authorization policy harus diterapkan pada project, issue, payment, dan notification.

## 29.3 Reliability

- Scheduler monitoring harus berjalan otomatis.
- Jika satu monitor gagal dicek, monitor lain tetap berjalan.
- Error monitoring harus dicatat ke log.
- Notifikasi website down tidak boleh spam.
- Incident hanya dibuat satu kali untuk satu downtime yang sedang berlangsung.

## 29.4 Maintainability

- Gunakan service layer untuk logic bisnis.
- Pisahkan controller admin dan client.
- Gunakan enum/constant di backend.
- Gunakan soft delete untuk data utama.
- Gunakan form request validation.
- Gunakan observer/event untuk membuat notifikasi otomatis.

## 29.5 Scalability

- Monitoring log dapat tumbuh sangat besar, sehingga perlu pagination dan retention.
- Untuk jumlah monitor besar, proses check sebaiknya dijalankan via queue.
- Check website dapat dibuat asynchronous agar tidak blocking.
- Notifikasi email/WhatsApp/Telegram sebaiknya dijalankan melalui queue.

---

## 30. Scheduler dan Background Job

## 30.1 Website Monitoring Scheduler

Command:

```txt
php artisan monitors:check
```

Jadwal:

```txt
everyMinute()
```

Tugas:

- Ambil semua website monitor aktif.
- Cek URL sesuai method.
- Simpan check log.
- Update current status.
- Buat atau resolve incident.
- Buat notification jika perlu.

## 30.2 Payment Reminder Scheduler

Command:

```txt
php artisan payments:check-due
```

Jadwal:

```txt
daily()
```

Tugas:

- Cari payment timeline dengan due date mendekati hari ini.
- Cari payment timeline overdue.
- Buat notifikasi payment_due dan payment_overdue.

## 30.3 Domain/Hosting Reminder Scheduler

Command:

```txt
php artisan assets:check-expiry
```

Jadwal:

```txt
daily()
```

Tugas:

- Cek domain yang expired_at mendekati tanggal tertentu.
- Cek hosting yang expired_at mendekati tanggal tertentu.
- Buat notifikasi domain_expired dan hosting_expired.

---

## 31. Business Rules Penting

## 31.1 Client

- Satu client dapat memiliki banyak project.
- Client status default active.
- Client soft deleted tidak tampil di list utama.
- Client yang memiliki project tidak boleh hard delete.

## 31.2 User

- Admin dapat melihat semua data.
- Client hanya dapat melihat data sesuai client ID.
- User client wajib terkait dengan client.
- User nonaktif tidak boleh login.

## 31.3 Project

- Project wajib memiliki client.
- Project dapat memiliki banyak links.
- Project dapat memiliki banyak members.
- Project dapat memiliki banyak payment timelines.
- Project dapat memiliki banyak website monitors.
- Project dapat memiliki banyak issues.
- Project dapat memiliki banyak maintenance logs.

## 31.4 Payment

- Satu payment timeline mewakili satu tagihan/rencana pembayaran.
- Planned amount bukan total project.
- Contract value adalah total nilai kontrak awal project.
- Biaya tambahan dicatat sebagai payment timeline baru.
- Free trial dicatat dengan planned amount 0.
- Langganan dengan harga berubah dicatat sebagai baris timeline bulanan berbeda.
- Remaining amount dihitung otomatis.

## 31.5 Monitoring

- Monitor aktif dicek otomatis.
- Setiap check menghasilkan log.
- Down incident dibuat ketika monitor dianggap benar-benar down.
- Recovery incident dicatat saat monitor kembali online.
- Notification down dan recovery dibuat satu kali per incident.

## 31.6 Issue

- Issue wajib terkait project dan client.
- Client hanya dapat membuat issue untuk project miliknya.
- Attachment harus terkait issue.
- Internal notes hanya untuk admin.

## 31.7 Notification

- Notifikasi dapat terkait ke payment, incident, issue, domain, hosting, atau maintenance melalui related type dan related ID.
- Dashboard notification wajib disimpan di database.
- Channel email/WhatsApp/Telegram dapat dikembangkan setelah MVP.

---

## 32. MVP Prioritas

## Phase 1 — Core Internal System

Fitur:

1. Login admin.
2. CRUD client.
3. CRUD user.
4. CRUD project.
5. CRUD project links.
6. CRUD payment timeline.
7. Dashboard basic.
8. CRUD website monitor.
9. Scheduler monitoring.
10. Website check logs.
11. Website incidents.
12. CRUD issue.
13. Upload issue attachment.
14. Notification dashboard.

## Phase 2 — Client Portal

Fitur:

1. Login client.
2. Client dashboard.
3. My projects.
4. Project detail.
5. My payments.
6. Create issue.
7. My issues.
8. Website status.
9. Notifications.

## Phase 3 — Operational Enhancement

Fitur:

1. Maintenance logs.
2. Domain assets.
3. Hosting assets.
4. Domain/hosting reminder.
5. Payment reminder.
6. Email notification.
7. WhatsApp/Telegram notification.

## Phase 4 — Reporting

Fitur:

1. Monthly revenue report.
2. Outstanding payment report.
3. Uptime report.
4. Incident report.
5. Issue report.
6. Client project summary.

---

## 33. Success Metrics

Produk dianggap berhasil jika:

- Semua client dan project dapat tercatat rapi.
- Admin dapat mengetahui project aktif, live, maintenance, paused, dan completed.
- Admin dapat mengetahui payment overdue.
- Admin dapat mengetahui website down dengan cepat.
- Issue client tidak tercecer di WhatsApp.
- Domain dan hosting tidak lupa diperpanjang.
- Client dapat melihat project dan issue miliknya.
- Admin dapat melihat histori maintenance project.
- Sistem dapat menjadi dashboard operasional utama software house.

---

## 34. Risiko dan Mitigasi

## 34.1 Website Check Logs Membesar

Risiko:

- Monitoring setiap menit menghasilkan banyak data.
- Database cepat besar.
- Query log bisa lambat.

Mitigasi:

- Gunakan pagination.
- Gunakan filter tanggal.
- Gunakan retention policy.
- Simpan log detail hanya 30–90 hari.
- Buat summary harian pada fase berikutnya.

## 34.2 Payment Terlalu Fleksibel

Risiko:

- Data pembayaran bisa tidak rapi.
- Admin bisa salah memilih type atau status.

Mitigasi:

- Gunakan dropdown.
- Gunakan form validation.
- Gunakan template payment timeline.
- Hitung remaining amount otomatis.
- Buat status update otomatis.

## 34.3 Client Mengakses Data Internal

Risiko:

- Data internal bisa bocor.

Mitigasi:

- Gunakan policy authorization.
- Pisahkan route admin dan client.
- Sembunyikan internal notes.
- Sembunyikan admin notes.
- Batasi project links yang tampil untuk client.

## 34.4 Notifikasi Spam

Risiko:

- Website down dapat membuat terlalu banyak notifikasi.

Mitigasi:

- Gunakan consecutive failures.
- Buat satu notifikasi saat incident dimulai.
- Buat satu notifikasi saat incident resolved.
- Jangan kirim notifikasi setiap check gagal.

## 34.5 Data Project Type Tidak Konsisten

Risiko:

- Karena project type berupa varchar, data bisa berbeda-beda format.

Mitigasi:

- Gunakan dropdown di frontend.
- Validasi value di backend.
- Gunakan daftar project type yang terkontrol.

---

## 35. Rekomendasi Struktur Folder Laravel

```txt
app/
  Http/
    Controllers/
      Admin/
        DashboardController.php
        ClientController.php
        UserController.php
        ProjectController.php
        ProjectLinkController.php
        ProjectMemberController.php
        PaymentTimelineController.php
        WebsiteMonitorController.php
        IssueController.php
        MaintenanceLogController.php
        DomainAssetController.php
        HostingAssetController.php
        NotificationController.php
      Client/
        DashboardController.php
        ProjectController.php
        PaymentController.php
        IssueController.php
        NotificationController.php
    Requests/
      ClientRequest.php
      ProjectRequest.php
      PaymentTimelineRequest.php
      WebsiteMonitorRequest.php
      IssueRequest.php

  Services/
    ClientService.php
    ProjectService.php
    PaymentTimelineService.php
    WebsiteMonitorService.php
    WebsiteIncidentService.php
    IssueService.php
    NotificationService.php
    AssetReminderService.php

  Models/
    Client.php
    User.php
    Project.php
    ProjectLink.php
    ProjectMember.php
    ProjectPaymentTimeline.php
    WebsiteMonitor.php
    WebsiteCheckLog.php
    WebsiteIncident.php
    Issue.php
    IssueAttachment.php
    MaintenanceLog.php
    DomainAsset.php
    HostingAsset.php
    Notification.php

  Console/
    Commands/
      CheckWebsiteMonitorsCommand.php
      CheckPaymentDueCommand.php
      CheckAssetExpiryCommand.php
```

---

## 36. Kesimpulan

Sistem ini dirancang sebagai platform internal software house untuk mengelola seluruh operasional project client dalam satu tempat.

Dengan rancangan database final, sistem sudah mampu menangani:

- Client management.
- User admin dan client.
- Project management.
- Project links fleksibel.
- Payment timeline fleksibel untuk beli putus dan langganan.
- Website uptime monitoring.
- Website incident tracking.
- Issue/bug tracking.
- Issue attachment.
- Maintenance log.
- Domain dan hosting reminder.
- Notification center.
- Client portal.

Untuk MVP, prioritas utama adalah membangun core internal system terlebih dahulu, kemudian dilanjutkan dengan client portal, reminder, dan reporting.
