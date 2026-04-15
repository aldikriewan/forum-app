# Branch Protection Setup untuk Master

## Langkah-Langkah di GitHub:

### 1. Buka Repository GitHub Anda
- Buka: `https://github.com/USERNAME/forum-app/settings/branches`

### 2. Add Branch Protection Rule
- Klik **"Add branch protection rule"**
- **Branch name pattern:** `master`
- Checklist semua ini:

### 3. Aktifkan Pengaturan Berikut:

☑ **Require pull request reviews before merging**
- Reviews required: 1
- Dismiss stale reviews: ON
- Require review from code owners: OFF

☑ **Require status checks to pass before merging**
- Require branches to be up to date: ON
- Search for status checks in the last week for this repository

☑ **Require conversation resolution before merging**
- ON

☑ **Include administrators**
- ON

☑ **Restrict who can push**
- Include branch managers: ON

### 4. Save Changes

---

## Hasil Akhir:

| Branch | Aturan |
|--------|--------|
| master | Hanya bisa di-merge via PR dari branch lain |
| testing-ci-cd | Bisa push langsung (bisa di-merge ke master via PR) |

---

## Cara Kerja:

1. Buat perubahan di branch `testing-ci-cd`
2. Push ke GitHub
3. Buat Pull Request ke `master`
4. GitHub akan run CI tests dulu
5. Kalau PASS + ada review → bisa merge ke master

---

## Alternatif - Tambah Require Test di PR:

Tambahkan di GitHub Actions workflow (.github/workflows/ci.yml) agar test harus PASS sebelum merge.