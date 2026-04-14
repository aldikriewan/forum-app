# Dokumentasi Aplikasi Forum Diskusi React + Redux

## Ringkasan
Aplikasi Forum Diskusi telah dibangun menggunakan React 18, Redux Toolkit, dan React Router. Aplikasi ini memanfaatkan Dicoding Forum API untuk semua operasi data. Semua state utama disimpan di Redux store, dan semua pemanggilan API dilakukan melalui Redux thunks.

## Struktur Folder
```
forum-app/
├── src/
│   ├── api/
│   │   └── apiClient.js              # Axios client dengan interceptors
│   ├── redux/
│   │   ├── slices/                   # 6 Redux slices
│   │   │   ├── authSlice.js
│   │   │   ├── userSlice.js
│   │   │   ├── threadSlice.js
│   │   │   ├── commentSlice.js
│   │   │   ├── leaderboardSlice.js
│   │   │   └── uiSlice.js
│   │   ├── thunks/                   # Redux async actions
│   │   │   ├── authThunks.js
│   │   │   ├── threadThunks.js
│   │   │   ├── commentThunks.js
│   │   │   └── leaderboardThunks.js
│   │   └── store.js                  # Redux store configuration
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   └── LoadingIndicator.jsx
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── Thread/
│   │   │   └── ThreadItem.jsx
│   │   └── Comment/
│   │       └── CommentItem.jsx
│   ├── pages/
│   │   ├── HomePage.jsx              # Daftar thread + filter
│   │   ├── ThreadDetailPage.jsx      # Detail + comments
│   │   ├── CreateThreadPage.jsx      # Form buat thread
│   │   └── LeaderboardPage.jsx       # Leaderboard
│   ├── utils/
│   │   └── helpers.js                # Utility functions
│   ├── App.jsx                       # Main app dengan routing
│   ├── App.css                       # Global styles
│   └── index.js                      # Entry point
├── .eslintrc.json                    # ESLint configuration
└── package.json
```

## Fitur Utama (Kriteria 1: Fungsionalitas)
✅ **Registrasi & Login**
- Registrasi dengan nama, email, password
- Login dengan email & password
- Auto login setelah registrasi
- Token disimpan di localStorage

✅ **Daftar Thread**
- Menampilkan semua thread dari API
- Setiap item menampilkan: judul, potongan body, waktu, author, jumlah komentar, votes
- Search berdasarkan judul dan konten
- Filter berdasarkan kategori (frontend-only)

✅ **Detail Thread**
- Menampilkan: judul, body, waktu, author info dengan avatar
- Menampilkan komentar dengan: konten, waktu, author, avatar
- Loading indicator saat fetch data

✅ **Membuat Thread**
- Form dengan: judul, konten, kategori (opsional)
- Validasi form
- Hanya untuk pengguna terautentikasi

✅ **Membuat Komentar**
- Form untuk menambah komentar
- Hanya untuk pengguna terautentikasi
- Auto-refresh thread detail setelah submit

✅ **Loading Indicator**
- Overlay dengan spinner saat loading
- Menampilkan teks loading

## Fitur Tambahan (Code Quality - Kriteria 2)
✅ **ESLint**
- File konfigurasi:.eslintrc.json
- Rules sesuai standar code style
- No console, prefer const, proper indentation

✅ **Code Convention**
- Menggunakan naming convention yang konsisten
- Modular component structure
- Proper prop-types validation

✅ **React Strict Mode**
- Enabled di App.jsx

## Arsitektur Aplikasi (Kriteria 3)
✅ **Redux Store**
- 6 slices untuk different domains
- Sebagian besar state disimpan di Redux
- localStorage untuk token persistence

✅ **No API Calls di Component Lifecycle**
- Semua API calls via Redux thunks
- Components hanya dispatch actions

✅ **Separation of Concerns**
- UI components di /components
- State logic di /redux
- API integration di /api

✅ **Modular & Reusable Components**
- ThreadItem - reusable untuk list
- CommentItem - reusable untuk comments
- Common components - Header, LoadingIndicator

## Saran yang Diimplementasikan
✅ **Saran 1: Voting System**
- Up-vote, down-vote, neutral-vote untuk thread
- Up-vote, down-vote, neutral-vote untuk comments
- Visual feedback dengan button active state
- Display jumlah votes

✅ **Saran 2: Leaderboard**
- Halaman leaderboard
- Menampilkan: rank, user info (avatar + nama), score
- Medal untuk top 3 (🥇🥈🥉)

✅ **Saran 3: Filter Thread by Kategori**
- Filter buttons di sidebar HomePage
- Frontend-only filtering
- Search juga tersedia

## Redux State Structure

### auth
```javascript
{
  token: string | null,
  user: object | null,
  isLoggedIn: boolean,
  loading: boolean,
  error: null | string
}
```

### threads
```javascript
{
  list: Thread[],
  detailMap: { [threadId]: ThreadDetail },
  loading: boolean,
  error: null | string,
  selectedThreadId: string | null,
  filterCategory: string | null
}
```

### users
```javascript
{
  list: User[],
  currentUser: User | null,
  loading: boolean,
  error: null | string
}
```

### comments
```javascript
{
  loading: boolean,
  error: null | string
}
```

### leaderboards
```javascript
{
  list: Leaderboard[],
  loading: boolean,
  error: null | string
}
```

### ui
```javascript
{
  isLoading: boolean,
  loadingText: string,
  notification: object | null
}
```

## Routing

| Route | Component | Deskripsi |
|-------|-----------|-----------|
| / | HomePage | Daftar thread |
| /thread/:threadId | ThreadDetailPage | Detail thread + comments |
| /create-thread | CreateThreadPage | Form buat thread (auth required) |
| /leaderboard | LeaderboardPage | Leaderboard |
| /login | LoginForm | Form login |
| /register | RegisterForm | Form registrasi |
| * | Navigate to / | Redirect |

## API Endpoints yang Digunakan

### Authentication
- POST /register - Register user
- POST /login - Login user
- GET /users/me - Get current user

### Threads
- GET /threads - Get all threads
- POST /threads - Create thread (auth required)
- GET /threads/{id} - Get thread detail
- POST /threads/{id}/up-vote - Up-vote thread (auth required)
- POST /threads/{id}/down-vote - Down-vote thread (auth required)
- POST /threads/{id}/neutral-vote - Neutralize vote (auth required)

### Comments
- POST /threads/{threadId}/comments - Create comment (auth required)
- POST /threads/{threadId}/comments/{commentId}/up-vote - Up-vote (auth required)
- POST /threads/{threadId}/comments/{commentId}/down-vote - Down-vote (auth required)
- POST /threads/{threadId}/comments/{commentId}/neutral-vote - Neutralize (auth required)

### Leaderboards
- GET /leaderboards - Get leaderboard

## Styling
- CSS Modules untuk setiap komponen
- Unified color scheme (blue: #3498db, dark: #2c3e50, light: #ecf0f1)
- Responsive design untuk mobile
- Consistent spacing dan typography

## Form Validations
✅ Login:
- Email required & valid format
- Password >= 6 karakter

✅ Register:
- Name required & >= 3 karakter
- Email required & valid format
- Password >= 6 karakter
- Password confirmation match

✅ Create Thread:
- Title required & >= 5 karakter
- Body required & >= 20 karakter
- Category optional

✅ Create Comment:
- Content tidak boleh kosong

## How to Run
```bash
cd forum-app
npm install
npm start
```

Development server akan berjalan di http://localhost:3000

## Build untuk Production
```bash
npm run build
```

## Testing
Untuk testing Redux store dan actions:
1. Buka browser DevTools
2. Inspect console untuk debugging
3. Redux DevTools bisa digunakan untuk advanced debugging

## Future Enhancements
- Add user profile page
- Add edit/delete thread & comment
- Add notifications
- Add more granular error handling
- Add unit tests
- Add E2E tests
- Performance optimization with memoization
- Pagination untuk thread list
