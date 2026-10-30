# Devlense — Development & Learning Roadmap

## هدف اصلی

تبدیل Devlense به یک API Client کاربردی با تمرکز بر توسعه قابلیت‌های اصلی محصول، بهبود تجربه کاربری و در مرحله بعد ارتقای معماری و کیفیت کد.

**استراتژی توسعه:**

1. ابتدا تکمیل قابلیت‌های اصلی محصول (Feature Development).
2. سپس Refactoring و بهبود معماری.
3. در ادامه افزایش کیفیت مهندسی نرم‌افزار، تست‌نویسی و بهینه‌سازی.

در مرحله فعلی، اولویت با تکمیل قابلیت‌هاست و نباید Refactoring گسترده مانع پیشرفت محصول شود.

---

# Phase 1 — Core Product Development

**اولویت فعلی: تکمیل قابلیت‌های اصلی Collections**

## 1. Postman Collection Import

هدف: کاربر بتواند Collectionهای ساخته‌شده در Postman را وارد Devlense کند.

- پشتیبانی از فرمت Postman Collection
- انتخاب و بارگذاری فایل JSON
- اعتبارسنجی ساختار فایل واردشده
- مدیریت فایل‌های JSON نامعتبر
- تبدیل ساختار Postman Collection به مدل داخلی Devlense
- پشتیبانی از Collectionهای دارای Folderهای تو در تو
- استخراج اطلاعات Requestها
- مدیریت Headerها، Query Parameters و Body
- مدیریت اطلاعات Authentication در صورت پشتیبانی
- نمایش خطاهای Import به شکل مناسب در UI

## 2. Collection Management

هدف: نمایش و مدیریت Collectionهای Import شده.

- نمایش Collectionهای Import شده
- نمایش Folderها و Requestهای داخل هر Collection
- نمایش تعداد Requestها
- امکان باز و بسته کردن Folderها
- انتخاب Request موردنظر
- جست‌وجو در Collectionها
- حذف Collection
- مدیریت Collectionهای تکراری
- نمایش مناسب Collectionهای خالی

## 3. Integration Between Collections and Request Page

هدف: کاربر بتواند Request موردنظر خود را از داخل Collection انتخاب کرده و آن را در صفحه Request مشاهده و اجرا کند.

- نمایش ساختار Collection در صفحه Request
- نمایش Folderها و Requestهای مربوط به هر Collection
- انتخاب Request از داخل Collection
- انتقال اطلاعات Request انتخاب‌شده به فرم اصلی
- مقداردهی HTTP Method
- مقداردهی URL
- مقداردهی Query Parameters
- مقداردهی Headers
- مقداردهی Request Body
- مقداردهی Authentication در صورت پشتیبانی
- امکان ویرایش اطلاعات Request پس از انتخاب
- امکان ارسال Request انتخاب‌شده
- حفظ ارتباط Request با Collection مربوطه

**معیار تکمیل این مرحله:**

کاربر بتواند یک Postman Collection را Import کند، ساختار آن را مشاهده کند، وارد Folder موردنظر شود، یک API را انتخاب کند، اطلاعات آن را در صفحه Request ببیند، تغییر دهد و درخواست را اجرا کند.

---

# Phase 2 — Refactoring & Architecture

پس از تکمیل قابلیت‌های اصلی Collection و اتصال آن به صفحه Request، وارد مرحله Refactoring می‌شوم.

در این مرحله تمرکز روی کاهش پیچیدگی، جداسازی مسئولیت‌ها و افزایش قابلیت نگهداری کد خواهد بود.

## 1. Refactor Request Component

وضعیت فعلی: منطق‌های مختلف Request در یک کامپوننت بزرگ قرار گرفته‌اند.

موارد موردنیاز:

- جداسازی منطق ارسال درخواست از UI
- استخراج Request Service
- استخراج منطق ساخت URL
- استخراج منطق مدیریت Headers
- استخراج منطق Authentication
- استخراج منطق مدیریت Response
- استخراج Custom Hookهای موردنیاز
- جداسازی Typeها و Interfaceها
- کاهش وابستگی کامپوننت‌ها به یکدیگر

ساختار پیشنهادی:

```text
features/
└── request/
    ├── components/
    │   ├── RequestForm.tsx
    │   ├── RequestHeaders.tsx
    │   ├── RequestParams.tsx
    │   ├── RequestAuth.tsx
    │   └── ResponseViewer.tsx
    ├── hooks/
    │   └── useRequest.ts
    ├── services/
    │   └── request.service.ts
    ├── utils/
    │   ├── buildRequest.ts
    │   └── parseResponse.ts
    └── types/
        └── request.types.ts
```

## 2. Request Engine Improvements

- پیاده‌سازی واقعی Request Timeout
- استفاده از AbortController
- امکان لغو Request توسط کاربر
- مدیریت Network Error
- مدیریت HTTP Error
- مدیریت Invalid URL
- مدیریت Response Parsing Error
- مدیریت پاسخ‌های بدون Body مانند 204
- مدیریت درخواست‌های هم‌زمان
- جلوگیری از نمایش Response قدیمی
- بهبود مدیریت خطا و نمایش پیام مناسب به کاربر

## 3. Environment Variables

- پیاده‌سازی جایگزینی متغیرها در URL
- جایگزینی متغیرها در Headers
- جایگزینی متغیرها در Request Body
- مدیریت Environmentهای مختلف
- امکان تغییر Environment فعال
- مدیریت متغیرهای تعریف‌نشده
- مدیریت متغیرهای حساس

## 4. Response Management

- پیاده‌سازی کامل تب Headers
- پیاده‌سازی Pretty Response
- پیاده‌سازی Raw Response
- تشخیص Content-Type
- نمایش Status Code
- نمایش Response Time
- نمایش Response Size
- مدیریت Responseهای غیر JSON
- مدیریت Responseهای بزرگ

## 5. Collections, History & Settings Improvements

- تکمیل عملیات CRUD مربوط به Collectionها
- پیاده‌سازی واقعی Search و Filter
- ذخیره‌سازی Collectionها
- ذخیره‌سازی History
- ذخیره‌سازی Environmentها
- اتصال تنظیمات به عملکرد واقعی برنامه
- بررسی و اصلاح قابلیت‌های نمایشی که هنوز عملکرد واقعی ندارند
- بررسی وضعیت Read Only در JsonEditor و غیرفعال کردن عملیات ویرایشی در این حالت

## 6. CORS & Request Architecture

- بررسی محدودیت‌های CORS در درخواست‌های مرورگر
- بررسی معماری مناسب برای ارسال Request به APIهای مختلف
- ارزیابی نیاز به Proxy سمت سرور
- بررسی محدودیت‌های امنیتی Proxy
- محافظت در برابر SSRF و دسترسی به آدرس‌های داخلی و خصوصی در صورت پیاده‌سازی Proxy

---

# Phase 3 — Code Quality & Testing

هدف: افزایش اطمینان از صحت عملکرد برنامه و کاهش احتمال ایجاد Regression در توسعه قابلیت‌های جدید.

## 1. TypeScript

- فعال‌سازی Strict Mode
- بررسی Typeهای موجود
- حذف Type Assertionهای غیرضروری
- جلوگیری از استفاده غیرضروری از `any`
- استفاده از Typeهای دقیق برای Request و Response
- بررسی Null و Undefined
- فعال‌سازی No Unchecked Indexed Access

## 2. Unit Testing

با استفاده از Vitest:

- تست Request Builder
- تست URL Builder
- تست Query Parameters
- تست Header Management
- تست Authentication
- تست Environment Variables
- تست Response Parser
- تست Error Handling
- تست Timeout و Request Cancellation

## 3. Integration Testing

با استفاده از React Testing Library و MSW:

- تست ارسال Request
- تست نمایش Response
- تست مدیریت خطاهای HTTP
- تست Import کردن Collection
- تست انتخاب Request از Collection
- تست انتقال اطلاعات Request به فرم اصلی
- تست CRUD مربوط به Collectionها
- تست Environment Management

## 4. UI & Performance

- بررسی Responsive Design
- بررسی Performance کامپوننت‌ها
- جلوگیری از Re-renderهای غیرضروری
- بررسی Accessibility
- بهبود Loading و Empty States
- بررسی Error States
- بررسی تجربه کاربری در عملیات طولانی

---

# Phase 4 — Learning Roadmap

در کنار توسعه Devlense، یادگیری باید به شکلی باشد که مستقیماً در کیفیت پیاده‌سازی پروژه تأثیر بگذارد.

## 1. JavaScript & TypeScript

اولویت: بسیار زیاد

- Closures
- Event Loop
- Promise و Async/Await
- Error Handling
- Array Methods
- Generics
- Utility Types
- Type Narrowing
- Discriminated Unions
- Type Inference

هدف: توانایی طراحی Typeهای دقیق و مدیریت منطق پیچیده بدون وابستگی به Type Assertionهای غیرضروری.

## 2. React

اولویت: بسیار زیاد

- Render و Re-render
- State Management
- useEffect و Dependencyها
- Closure در React
- Referential Equality
- useMemo و useCallback
- Custom Hooks
- Context API
- Controlled و Uncontrolled Components
- Component Composition
- Performance Optimization

هدف: توانایی طراحی کامپوننت‌های قابل نگهداری و درک رفتار React در سناریوهای واقعی.

## 3. Web APIs & HTTP

اولویت: بسیار زیاد

- Fetch API
- Request و Response
- Headers
- HTTP Methods
- HTTP Status Codes
- CORS
- AbortController
- FormData
- URL و URLSearchParams
- Authentication
- Browser Storage
- File API

هدف: درک عمیق ارتباط مرورگر با سرور و توانایی پیاده‌سازی یک API Client قابل اعتماد.

## 4. Software Engineering

اولویت: زیاد

- Separation of Concerns
- Single Responsibility Principle
- Dependency Management
- Component Architecture
- Service Layer
- Error Handling Strategy
- Data Modeling
- State Persistence
- Refactoring Techniques
- Clean Code

هدف: حرکت از صرفاً پیاده‌سازی قابلیت‌ها به طراحی و توسعه نرم‌افزار قابل نگهداری.

## 5. Testing

اولویت: زیاد

- Vitest
- React Testing Library
- MSW
- Unit Testing
- Integration Testing
- Mocking
- Edge Case Testing
- Regression Testing

هدف: توانایی اطمینان از صحت عملکرد برنامه بدون وابستگی به تست دستی.

## 6. Next.js

اولویت: زیاد، پس از تثبیت مهارت‌های اصلی React

- Next.js App Router
- Server Components
- Client Components
- Server Actions
- Route Handlers
- SSR
- SSG
- ISR
- Caching
- Revalidation
- Authentication
- Metadata و SEO
- Performance Optimization

هدف: آمادگی برای استخدام در موقعیت‌های React و Next.js و توانایی توسعه محصولات واقعی با Next.js.

## 7. Backend & Deployment Fundamentals

اولویت: متوسط

- آشنایی با Node.js
- درک HTTP و REST API
- آشنایی با PostgreSQL
- مفاهیم SQL
- Authentication و Authorization
- Docker Fundamentals
- Environment Variables
- CI/CD Fundamentals
- آشنایی با Deployment

هدف: داشتن دانش مکمل برای همکاری بهتر با تیم Backend و درک چرخه کامل تحویل محصول.

---

# Phase 5 — AI-Assisted Development

هدف: استفاده از AI برای افزایش بهره‌وری بدون وابستگی به آن در تحلیل و تصمیم‌گیری فنی.

- تحلیل مسئله قبل از درخواست کد از AI
- طراحی راه‌حل اولیه به‌صورت مستقل
- استفاده از AI برای بررسی معماری
- بررسی مزایا و معایب راه‌حل‌های پیشنهادی
- بررسی Edge Caseها
- استفاده از AI برای تولید تست
- بررسی امنیت و Performance کد تولیدشده
- توانایی توضیح و دفاع از تمام کدهای واردشده به پروژه
- توانایی تغییر و توسعه کد بدون نیاز به تولید مجدد آن توسط AI

**قانون اصلی:**

AI ابزار توسعه است، نه جایگزین درک فنی و تصمیم‌گیری مهندسی.

---

# Development Principles

اصول موردنظر در ادامه توسعه Devlense:

1. اولویت با تکمیل قابلیت‌های اصلی محصول است.
2. از Refactoring گسترده در حین توسعه قابلیت‌های اصلی خودداری می‌شود، مگر اینکه مانع توسعه یا ایجاد باگ جدی شود.
3. هر قابلیت باید پس از تکمیل، از نظر عملکرد و تجربه کاربری بررسی شود.
4. تا حد امکان قابلیت‌های جدید به‌صورت مستقل و قابل تست توسعه داده شوند.
5. از پیچیده‌سازی زودهنگام معماری خودداری شود.
6. از AI برای افزایش بهره‌وری استفاده شود، اما تصمیمات فنی باید قابل درک و دفاع باشند.
7. پس از تکمیل جریان اصلی محصول، Refactoring و تست‌نویسی به‌صورت هدفمند انجام شود.

---

# Definition of Done

یک قابلیت زمانی تکمیل‌شده محسوب می‌شود که:

- عملکرد مورد انتظار را داشته باشد.
- سناریوهای اصلی آن بررسی شده باشند.
- خطاهای قابل پیش‌بینی مدیریت شده باشند.
- رابط کاربری وضعیت Loading، Error و Empty را پوشش دهد.
- با قابلیت‌های موجود تداخل نداشته باشد.
- کد آن قابل درک و توسعه باشد.
