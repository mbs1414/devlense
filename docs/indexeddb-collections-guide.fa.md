<div dir="rtl">

# آموزش کامل و سادهٔ <code dir="ltr">IndexedDB</code> با مثال صفحهٔ <code dir="ltr">Collections</code>

> **مخاطب:** برنامه‌نویس تازه‌کار در <code dir="ltr">React</code> و <code dir="ltr">TypeScript</code>  
> **مثال واقعی:** وارد کردن فایل <code dir="ltr">Postman Collection</code>، ذخیرهٔ آن در مرورگر و نمایش دوباره پس از باز کردن صفحه  
> **پیش‌نیاز:** آشنایی خیلی ابتدایی با متغیر، تابع و آرایه در <code dir="ltr">JavaScript</code>

در این راهنما از **همان کدی** استفاده می‌کنیم که برای صفحهٔ <code dir="ltr">Collections</code> نوشتیم. هدف فقط حفظ کردن چند دستور نیست؛ می‌خواهیم بدانیم **هر خط چه کاری می‌کند، چرا لازم است و هنگام اجرا چه اتفاقی می‌افتد**.

---

## ۱. اصلاً <code dir="ltr">IndexedDB</code> چیست؟

<code dir="ltr">IndexedDB</code> یک **پایگاه دادهٔ داخلی مرورگر** است. یعنی مرورگرهایی مثل <code dir="ltr">Chrome</code>، <code dir="ltr">Edge</code> و <code dir="ltr">Firefox</code> قابلیتی دارند که برنامهٔ وب بتواند اطلاعاتش را در خودِ مرورگر ذخیره کند.

فرض کن یک فایل <code dir="ltr">Postman Collection</code> را وارد برنامه می‌کنی. این فایل شامل نام کالکشن، پوشه‌ها، درخواست‌های <code dir="ltr">GET</code> و <code dir="ltr">POST</code> و اطلاعات دیگری است.

اگر اطلاعات را فقط در <code dir="ltr">React state</code> نگه داری، تا زمانی که صفحه باز است آن‌ها را می‌بینی؛ ولی با تازه‌سازی صفحه، آن وضعیت حافظه از ابتدا ساخته می‌شود. **<code dir="ltr">IndexedDB</code> کمک می‌کند یک نسخهٔ ذخیره‌شده از اطلاعات داشته باشیم** تا هنگام باز شدن دوبارهٔ صفحه آن را بخوانیم.

یک تشبیه ساده:

- **<code dir="ltr">React state</code>** مثل کاغذی است که همین حالا روی میز کار گذاشته‌ای؛ برای نمایش سریع و تغییر رابط کاربری مناسب است.
- **<code dir="ltr">IndexedDB</code>** مثل کشوی پرونده‌های کنار میز است؛ اطلاعات را در آن می‌گذاری و دفعهٔ بعد دوباره از آن می‌خوانی.
- **<code dir="ltr">setCollections</code>** یعنی اطلاعاتِ روی میز را تغییر بده تا صفحه به‌روز شود.
- **<code dir="ltr">saveCollectionToIndexedDB</code>** یعنی یک نسخه را داخل کشو نگه دار.

**نکتهٔ مهم:** <code dir="ltr">IndexedDB</code> دیتابیس سرور نیست؛ در مرورگر و برای همان وب‌سایت ذخیره می‌شود. نگهداری آن در استفادهٔ عادی پایدار است، اما **پشتیبان دائمی و تضمین‌شده** محسوب نمی‌شود؛ مثلاً پاک کردن داده‌های سایت می‌تواند آن را حذف کند.

### جریان کار ما

**هنگام وارد کردن فایل:**

1. فایل کالکشن با فرمت <code dir="ltr">JSON</code> انتخاب می‌شود.
2. محتوای فایل خوانده می‌شود.
3. تابع <code dir="ltr">JSON.parse</code> متن را به شیء جاوااسکریپت تبدیل می‌کند.
4. تابع <code dir="ltr">isPostmanCollection</code> ساختار داده را اعتبارسنجی می‌کند.
5. کالکشن در <code dir="ltr">IndexedDB</code> ذخیره می‌شود.
6. داده در وضعیت نمایشی ری‌اکت (<code dir="ltr">React state</code>) قرار می‌گیرد.
7. کالکشن و درخواست‌های آن در صفحه نمایش داده می‌شوند.

**پس از تازه‌سازی صفحه:**

1. صفحه دوباره باز می‌شود.
2. کالکشن‌ها از <code dir="ltr">IndexedDB</code> خوانده می‌شوند.
3. داده‌ها در وضعیت نمایشی ری‌اکت قرار می‌گیرند.
4. کالکشن‌ها بدون وارد کردن دوبارهٔ فایل نمایش داده می‌شوند.

---

## ۲. <code dir="ltr">IndexedDB</code> چه ساختاری دارد؟

از بیرون، ساختار ساده‌ای دارد:

<div dir="ltr" align="left">

```text
Browser
└── Database: postman-collections-db
    └── Object Store: collections
        ├── Key: 1  →  Collection A
        ├── Key: 2  →  Collection B
        └── Key: 3  →  Collection C
```

</div>

در این مثال سه مفهوم داریم:

| مفهوم | معنی خیلی ساده | نمونه در کد ما |
|---|---|---|
| <code dir="ltr">Database</code> | فضای اصلی ذخیرهٔ داده | <code dir="ltr">postman-collections-db</code> |
| <code dir="ltr">Object Store</code> | مجموعه‌ای از رکوردهای مرتبط؛ تا حدی شبیه جدول | <code dir="ltr">collections</code> |
| <code dir="ltr">Record</code> | یک دادهٔ ذخیره‌شده | یک شیء کامل <code dir="ltr">PostmanCollection</code> |
| <code dir="ltr">Key</code> | شناسهٔ رکورد برای تشخیص آن از بقیه | <code dir="ltr">1</code>، <code dir="ltr">2</code>، <code dir="ltr">3</code> |

یک رکورد ممکن است چنین محتوایی داشته باشد:

<div dir="ltr" align="left">

```json
{
  "info": {
    "name": "User APIs",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Users",
      "request": {
        "method": "GET",
        "url": "https://example.com/users"
      }
    }
  ]
}
```

</div>

این فقط **یک مثال ساده‌شده** است. فایل‌های واقعی <code dir="ltr">Postman</code> می‌توانند پوشه‌ها، متغیرها و ساختارهای تودرتوی بیشتری داشته باشند.

در کد ما <code dir="ltr">Key</code> را مرورگر به‌صورت خودکار ایجاد می‌کند. بنابراین **شناسهٔ ذخیره‌سازی لزوماً داخل شیء کالکشن نیست**.

---

## ۳. قبل از کد: چرا کار با <code dir="ltr">IndexedDB</code> غیرهم‌زمان است؟

بعضی کارها در <code dir="ltr">JavaScript</code> تقریباً فوری انجام می‌شوند؛ مثلاً:

<div dir="ltr" align="left">

```ts
const count = 2 + 3
```

</div>

ولی خواندن و نوشتن در دیتابیس ممکن است کمی زمان ببرد. مرورگر نمی‌خواهد در این مدت اجرای صفحه را متوقف کند. به همین دلیل رابط اصلی <code dir="ltr">IndexedDB</code> بر پایهٔ **درخواست‌ها و رویدادها** ساخته شده است.

مثلاً:

<div dir="ltr" align="left">

```ts
const request = indexedDB.open("my-db", 1)
```

</div>

این خط به معنی «دیتابیس کاملاً باز شد» نیست. معنی آن این است: «درخواستی برای باز کردن دیتابیس ثبت شد.» بعداً یکی از رویدادها خبر می‌دهد:

- <code dir="ltr">onsuccess</code>: عملیات موفق شد.
- <code dir="ltr">onerror</code>: عملیات خطا داشت.
- <code dir="ltr">onupgradeneeded</code>: هنگام ایجاد دیتابیس یا تغییر نسخه، باید ساختارش ساخته یا تغییر داده شود.

در کد ما برای خواناتر شدن این رویدادها، از <code dir="ltr">Promise</code> و <code dir="ltr">async/await</code> استفاده کرده‌ایم.

### <code dir="ltr">Promise</code> یعنی چه؟

<code dir="ltr">Promise</code> نمایندهٔ نتیجه‌ای است که **الان آماده نیست، ولی بعداً مشخص می‌شود**. آن نتیجه یا موفق می‌شود یا خطا می‌دهد.

<div dir="ltr" align="left">

```ts
return new Promise((resolve, reject) => {
  // یک عملیات غیرهم‌زمان را شروع می‌کنیم.

  // وقتی موفق شد:
  // resolve(result)

  // اگر خطا داشت:
  // reject(error)
})
```

</div>

- <code dir="ltr">resolve(value)</code> یعنی عملیات با موفقیت تمام شد و <code dir="ltr">value</code> نتیجهٔ آن است.
- <code dir="ltr">reject(error)</code> یعنی عملیات شکست خورد و خطا به کدِ فراخواننده منتقل می‌شود.
- <code dir="ltr">await</code> یعنی درون یک تابع <code dir="ltr">async</code>، منتظر نتیجهٔ یک <code dir="ltr">Promise</code> بمان؛ بدون اینکه کل رابط کاربری مرورگر قفل شود.

مثلاً:

<div dir="ltr" align="left">

```ts
const db = await openCollectionsDatabase()
```

</div>

یعنی «نتیجهٔ باز شدن دیتابیس را بگیر و بعد به سراغ خط بعد برو».

---

## ۴. سه ثابت اول کد چه هستند؟

این بخش را بالای فایل <code dir="ltr">collections.tsx</code>، خارج از تابع کامپوننت، گذاشتیم:

<div dir="ltr" align="left">

```ts
const DB_NAME = "postman-collections-db"
const DB_VERSION = 1
const STORE_NAME = "collections"
```

</div>

### <code dir="ltr">DB_NAME</code>

نام دیتابیس ما است. اگر این دیتابیس قبلاً برای همین مبدأ وب وجود داشته باشد، هنگام باز کردن معمولاً همان دیتابیس را استفاده می‌کنیم؛ در غیر این صورت ساخته می‌شود.

### <code dir="ltr">DB_VERSION</code>

نسخهٔ **ساختار دیتابیس** است، نه نسخهٔ برنامه و نه تعداد رکوردها.

برای مثال، الان نسخهٔ <code dir="ltr">1</code> فقط یک <code dir="ltr">Object Store</code> به نام <code dir="ltr">collections</code> می‌سازد. اگر بعداً بخواهیم ساختار دیتابیس را تغییر دهیم، معمولاً نسخه را مثلاً به <code dir="ltr">2</code> افزایش می‌دهیم و منطق مهاجرت ساختار را به <code dir="ltr">onupgradeneeded</code> اضافه می‌کنیم.

**نباید** برای هر <code dir="ltr">Import</code> نسخه را افزایش دهیم؛ وارد کردن دادهٔ جدید تغییر ساختار دیتابیس نیست.

### <code dir="ltr">STORE_NAME</code>

نام محلی است که رکوردهای کالکشن در آن نگهداری می‌شوند. یک دیتابیس می‌تواند چند <code dir="ltr">Object Store</code> داشته باشد؛ مثلاً در آینده <code dir="ltr">collections</code> و <code dir="ltr">environments</code>.

---

## ۵. تابع <code dir="ltr">openCollectionsDatabase</code> را خط‌به‌خط بفهمیم

کد ما:

<div dir="ltr" align="left">

```ts
function openCollectionsDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          autoIncrement: true,
        })
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}
```

</div>

### خط اول: تعریف تابع و نوع خروجی

<div dir="ltr" align="left">

```ts
function openCollectionsDatabase(): Promise<IDBDatabase>
```

</div>

- <code dir="ltr">function</code>: داریم یک تابع تعریف می‌کنیم.
- <code dir="ltr">openCollectionsDatabase</code>: نامی که برای آن انتخاب کردیم.
- <code dir="ltr">Promise&lt;IDBDatabase&gt;</code>: یعنی این تابع در نهایت یک شیء اتصال به دیتابیس از نوع <code dir="ltr">IDBDatabase</code> به ما می‌دهد، ولی نتیجه **غیرهم‌زمان** است.

### خط دوم: ساختن <code dir="ltr">Promise</code>

<div dir="ltr" align="left">

```ts
return new Promise((resolve, reject) => {
```

</div>

از اینجا تا انتهای بدنهٔ <code dir="ltr">Promise</code> تعریف می‌کنیم که **چه زمانی عملیات موفق یا ناموفق محسوب شود**.

### درخواست باز کردن دیتابیس

<div dir="ltr" align="left">

```ts
const request = indexedDB.open(DB_NAME, DB_VERSION)
```

</div>

- <code dir="ltr">indexedDB</code>: رابط داخلی مرورگر برای کار با این پایگاه داده.
- <code dir="ltr">.open(...)</code>: درخواست باز کردن یا ایجاد دیتابیس.
- <code dir="ltr">DB_NAME</code>: نام دیتابیس.
- <code dir="ltr">DB_VERSION</code>: نسخهٔ ساختار دیتابیس.
- <code dir="ltr">request</code>: شیئی که نتیجه و رویدادهای این درخواست را در اختیارمان می‌گذارد.

### رویداد <code dir="ltr">onupgradeneeded</code>

<div dir="ltr" align="left">

```ts
request.onupgradeneeded = () => {
  const db = request.result

  if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.createObjectStore(STORE_NAME, {
      autoIncrement: true,
    })
  }
}
```

</div>

وقتی دیتابیس برای بار اول ساخته می‌شود، یا نسخهٔ ساختار آن افزایش پیدا می‌کند، این بخش اجرا می‌شود.

- <code dir="ltr">request.result</code>: شیء دیتابیسِ بازشده را می‌گیریم.
- <code dir="ltr">db.objectStoreNames</code>: فهرست نام‌های <code dir="ltr">Object Store</code> موجود.
- <code dir="ltr">.contains(STORE_NAME)</code>: بررسی می‌کند آیا فروشگاه <code dir="ltr">collections</code> وجود دارد یا نه.
- <code dir="ltr">!</code>: یعنی «نه». بنابراین شرط می‌پرسد: «اگر این فروشگاه وجود ندارد، آن را بساز.»
- <code dir="ltr">db.createObjectStore(...)</code>: فروشگاه جدید را می‌سازد.
- <code dir="ltr">autoIncrement: true</code>: برای رکوردهای جدید، کلید عددی خودکار ایجاد می‌کند.

چرا شرط <code dir="ltr">contains</code> لازم است؟ چون نمی‌خواهیم فروشگاهی با نام تکراری بسازیم؛ این کار خطا می‌دهد.

**نکته:** این تابع در هر بار ورود به صفحه ممکن است دیتابیس را باز کند، ولی <code dir="ltr">onupgradeneeded</code> **در هر بار باز کردن اجرا نمی‌شود**؛ فقط هنگام ایجاد اولیه یا ارتقای نسخه.

### نتیجهٔ موفق و ناموفق

<div dir="ltr" align="left">

```ts
request.onsuccess = () => {
  resolve(request.result)
}

request.onerror = () => {
  reject(request.error)
}
```

</div>

اگر باز کردن موفق شود، <code dir="ltr">resolve</code> خود دیتابیس را به کسی می‌دهد که <code dir="ltr">await openCollectionsDatabase()</code> نوشته است. اگر خطایی رخ دهد، <code dir="ltr">reject</code> خطا را منتقل می‌کند تا بتوانیم آن را با <code dir="ltr">try/catch</code> مدیریت کنیم.

**خلاصهٔ تابع:** اتصال به دیتابیس را باز می‌کند و اگر لازم باشد، ساختار اولیهٔ آن را می‌سازد.

---

## ۶. «تراکنش» یا <code dir="ltr">Transaction</code> چیست؟

قبل از دیدن تابع ذخیره، باید <code dir="ltr">Transaction</code> را بشناسیم.

فرض کن می‌خواهی تغییری در یک پرونده ایجاد کنی. بهتر است مشخص باشد این عملیات **شروع شده، موفق تمام شده یا لغو شده است**. <code dir="ltr">IndexedDB</code> برای کار با رکوردها از <code dir="ltr">Transaction</code> استفاده می‌کند.

در پروژهٔ ما:

<div dir="ltr" align="left">

```ts
const transaction = db.transaction(STORE_NAME, "readwrite")
```

</div>

یعنی «در دیتابیس بازشده، یک تراکنش روی فروشگاه <code dir="ltr">collections</code> ایجاد کن که اجازهٔ خواندن و نوشتن دارد.»

دو حالت مهم:

| حالت | کاربرد |
|---|---|
| <code dir="ltr">readonly</code> | فقط خواندن اطلاعات؛ مثل نمایش فهرست کالکشن‌ها |
| <code dir="ltr">readwrite</code> | خواندن و تغییر دادن اطلاعات؛ مثل ذخیرهٔ کالکشن جدید |

در تراکنش، این دو رویداد را به کار بردیم:

- <code dir="ltr">transaction.oncomplete</code>: تراکنش **واقعاً با موفقیت به پایان رسید**.
- <code dir="ltr">transaction.onabort</code>: تراکنش لغو شد؛ معمولاً به دلیل خطای یک عملیات یا لغو صریح.

موفق شدن یک **درخواست** لزوماً همان پایان موفق کل **تراکنش** نیست. به همین دلیل، برای ذخیره کردن، <code dir="ltr">resolve()</code> را در <code dir="ltr">transaction.oncomplete</code> قرار دادیم.

---

## ۷. تابع ذخیرهٔ کالکشن را خط‌به‌خط بخوانیم

<div dir="ltr" align="left">

```ts
async function saveCollectionToIndexedDB(
  collection: PostmanCollection,
): Promise<void> {
  const db = await openCollectionsDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")

    transaction.objectStore(STORE_NAME).add(collection)

    transaction.oncomplete = () => {
      db.close()
      resolve()
    }

    transaction.onabort = () => {
      db.close()
      reject(transaction.error ?? new Error("Save failed"))
    }
  })
}
```

</div>

### عنوان تابع

<div dir="ltr" align="left">

```ts
async function saveCollectionToIndexedDB(
  collection: PostmanCollection,
): Promise<void>
```

</div>

- <code dir="ltr">async</code>: تابع غیرهم‌زمان است و می‌تواند از <code dir="ltr">await</code> استفاده کند.
- <code dir="ltr">collection: PostmanCollection</code>: ورودیِ تابع، یک کالکشن با نوع تعریف‌شده در <code dir="ltr">TypeScript</code> است.
- <code dir="ltr">Promise&lt;void&gt;</code>: نتیجهٔ نهایی موفق یا ناموفق است، اما در حالت موفق **مقداری برنمی‌گردانیم**. کلمهٔ <code dir="ltr">void</code> یعنی «مقدار خروجی نداریم»؛ نه اینکه کاری انجام نمی‌شود.

### باز کردن دیتابیس

<div dir="ltr" align="left">

```ts
const db = await openCollectionsDatabase()
```

</div>

اول اتصال دیتابیس را آماده می‌کنیم. بعد از آماده شدن، سراغ نوشتن می‌رویم.

### آغاز تراکنش نوشتن

<div dir="ltr" align="left">

```ts
const transaction = db.transaction(STORE_NAME, "readwrite")
```

</div>

برای ذخیره، اجازهٔ نوشتن لازم داریم؛ پس حالت <code dir="ltr">readwrite</code> را انتخاب می‌کنیم.

### عملیات واقعی ذخیره

<div dir="ltr" align="left">

```ts
transaction.objectStore(STORE_NAME).add(collection)
```

</div>

این خط سه قسمت دارد:

1. <code dir="ltr">transaction</code>: تراکنشی که ساخته‌ایم.
2. <code dir="ltr">.objectStore(STORE_NAME)</code>: فروشگاه <code dir="ltr">collections</code> را در همین تراکنش انتخاب کن.
3. <code dir="ltr">.add(collection)</code>: شیء کالکشن را **به‌عنوان رکورد جدید** اضافه کن.

چون فروشگاه را با <code dir="ltr">autoIncrement: true</code> ساختیم، برای این رکورد یک کلید جدید ساخته می‌شود.

**توجه:** <code dir="ltr">.add()</code> در کد فعلی به معنی «اضافه کردن رکورد جدید» است، نه «اگر قبلاً بود، به‌روزرسانی کن». با ساختار فعلی، وارد کردن دوبارهٔ همان فایل، رکورد جدیدی ایجاد می‌کند.

### پایان موفق ذخیره

<div dir="ltr" align="left">

```ts
transaction.oncomplete = () => {
  db.close()
  resolve()
}
```

</div>

وقتی تراکنش موفق تمام می‌شود:

1. <code dir="ltr">db.close()</code>: اتصال مربوط به این عملیات را می‌بندیم.
2. <code dir="ltr">resolve()</code>: به کدِ صدا‌زننده خبر می‌دهیم که عملیات ذخیره موفق بود.

### خطا در ذخیره

<div dir="ltr" align="left">

```ts
transaction.onabort = () => {
  db.close()
  reject(transaction.error ?? new Error("Save failed"))
}
```

</div>

اگر تراکنش لغو شود:

1. اتصال را می‌بندیم.
2. <code dir="ltr">reject(...)</code> خطا را منتقل می‌کند.
3. عبارت <code dir="ltr">??</code> یعنی «اگر سمت چپ <code dir="ltr">null</code> یا <code dir="ltr">undefined</code> بود، از سمت راست استفاده کن».
4. بنابراین اگر <code dir="ltr">transaction.error</code> در دسترس نباشد، خطای عمومی <code dir="ltr">Save failed</code> ساخته می‌شود.

**نکتهٔ تکمیلی:** این نسخهٔ ساده فقط رویداد <code dir="ltr">onabort</code> را برای خطای تراکنش مدیریت می‌کند. برای کدهای تولیدی ممکن است بخواهیم <code dir="ltr">transaction.onerror</code> و شرایط دیگری مثل بسته شدن غیرمنتظرهٔ اتصال را نیز دقیق‌تر ثبت و مدیریت کنیم.

**خلاصهٔ تابع:** دیتابیس را باز می‌کند، یک رکورد جدید می‌نویسد و فقط پس از پایان موفق تراکنش، عملیات را موفق اعلام می‌کند.

---

## ۸. تابع خواندن کالکشن‌های ذخیره‌شده

<div dir="ltr" align="left">

```ts
async function loadCollectionsFromIndexedDB(): Promise<
  PostmanCollection[]
> {
  const db = await openCollectionsDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const request = transaction.objectStore(STORE_NAME).getAll()

    let collections: PostmanCollection[] = []

    request.onsuccess = () => {
      collections = request.result as PostmanCollection[]
    }

    transaction.oncomplete = () => {
      db.close()
      resolve(collections)
    }

    transaction.onabort = () => {
      db.close()
      reject(transaction.error ?? new Error("Load failed"))
    }
  })
}
```

</div>

### نوع خروجی

<div dir="ltr" align="left">

```ts
Promise<PostmanCollection[]>
```

</div>

این یعنی تابع در نهایت **آرایه‌ای از کالکشن‌ها** را برمی‌گرداند؛ ممکن است آرایه خالی باشد.

### تراکنش فقط‌خواندنی

<div dir="ltr" align="left">

```ts
const transaction = db.transaction(STORE_NAME, "readonly")
```

</div>

برای نمایش کالکشن‌ها نیازی به تغییر دیتابیس نداریم؛ بنابراین <code dir="ltr">readonly</code> مناسب است.

### متد <code dir="ltr">getAll()</code>

<div dir="ltr" align="left">

```ts
const request = transaction.objectStore(STORE_NAME).getAll()
```

</div>

<code dir="ltr">getAll()</code> درخواست می‌دهد که **تمام مقدارهای رکوردهای این فروشگاه** خوانده شوند. نتیجه فوراً آماده نیست؛ ابتدا شیء <code dir="ltr">request</code> برمی‌گردد.

در مثال ما، اگر سه کالکشن ذخیره شده باشند، نتیجه آرایه‌ای از سه شیء کالکشن خواهد بود.

**نکته:** <code dir="ltr">getAll()</code> در این شکل، **مقدار رکوردها** را برمی‌گرداند؛ کلیدهای خودکار <code dir="ltr">1</code>، <code dir="ltr">2</code> و <code dir="ltr">3</code> را به صورت فیلد داخل هر کالکشن اضافه نمی‌کند. برای حذف یا ویرایش یک رکورد مشخص در آینده، باید شیوهٔ دسترسی به کلیدها را نیز طراحی کنیم.

### دریافت نتیجهٔ درخواست

<div dir="ltr" align="left">

```ts
let collections: PostmanCollection[] = []

request.onsuccess = () => {
  collections = request.result as PostmanCollection[]
}
```

</div>

- <code dir="ltr">let</code>: متغیری که مقدارش بعداً تغییر می‌کند.
- مقدار اولیهٔ <code dir="ltr">[]</code>: در ابتدا آرایه خالی است.
- <code dir="ltr">request.onsuccess</code>: وقتی درخواست خواندن موفق شد، مقدار برگشتی را می‌گیریم.
- <code dir="ltr">request.result</code>: داده‌هایی که <code dir="ltr">getAll()</code> خوانده است.
- <code dir="ltr">as PostmanCollection[]</code>: به <code dir="ltr">TypeScript</code> اعلام می‌کنیم که انتظار داریم نتیجه آرایه‌ای از کالکشن‌ها باشد.

**خیلی مهم:** عبارت <code dir="ltr">as PostmanCollection[]</code> داده را واقعاً اعتبارسنجی نمی‌کند؛ فقط یک **اعلام نوع برای <code dir="ltr">TypeScript</code>** است. فرض ما بر این است که خودمان هنگام ذخیره، داده را اعتبارسنجی کرده‌ایم. در برنامه‌های حساس می‌توان هنگام خواندن نیز اعتبارسنجی کرد.

### ارسال آرایه به کامپوننت

<div dir="ltr" align="left">

```ts
transaction.oncomplete = () => {
  db.close()
  resolve(collections)
}
```

</div>

پس از پایان تراکنش، آرایه را برمی‌گردانیم. به همین دلیل در کامپوننت می‌توانیم بنویسیم:

<div dir="ltr" align="left">

```ts
const savedCollections = await loadCollectionsFromIndexedDB()
```

</div>

---

## ۹. نقش <code dir="ltr">React state</code> چیست و چرا هنوز به آن نیاز داریم؟

این خط داخل کامپوننت قرار دارد:

<div dir="ltr" align="left">

```tsx
const [collections, setCollections] = useState<PostmanCollection[]>([])
```

</div>

به زبان ساده:

- <code dir="ltr">collections</code>: **وضعیت فعلی برای نمایش در صفحه**.
- <code dir="ltr">setCollections</code>: تابعی برای تغییر این وضعیت و درخواست رندر دوبارهٔ رابط کاربری.
- <code dir="ltr">useState&lt;PostmanCollection[]&gt;([])</code>: مقدار اولیه یک آرایهٔ خالی است.

چرا خودِ <code dir="ltr">IndexedDB</code> را مستقیم داخل JSX نمایش نمی‌دهیم؟ چون <code dir="ltr">IndexedDB</code> به‌صورت غیرهم‌زمان داده برمی‌گرداند، ولی <code dir="ltr">React</code> برای رندر کردن با <code dir="ltr">state</code> راحت‌تر کار می‌کند. بنابراین از دیتابیس **می‌خوانیم** و نتیجه را داخل <code dir="ltr">state</code> قرار می‌دهیم.

<div dir="ltr" align="left">

```tsx
const savedCollections = await loadCollectionsFromIndexedDB()
setCollections(savedCollections)
```

</div>

و هنگام وارد کردن فایل جدید:

<div dir="ltr" align="left">

```tsx
setCollections((previous) => [...previous, collection])
```

</div>

قسمت‌های خط آخر:

- <code dir="ltr">previous</code>: آرایهٔ قبلیِ <code dir="ltr">state</code>.
- <code dir="ltr">...previous</code>: عناصر قبلی را در آرایهٔ جدید کپی می‌کند.
- <code dir="ltr">collection</code>: کالکشن تازه را به انتهای آرایه می‌افزاید.
- <code dir="ltr">setCollections(...)</code>: به <code dir="ltr">React</code> می‌گوید وضعیت تغییر کرده و نمایش باید به‌روزرسانی شود.

**فرق اصلی:** <code dir="ltr">setCollections</code> دیتابیس را ذخیره نمی‌کند؛ <code dir="ltr">saveCollectionToIndexedDB</code> نیز به‌تنهایی نمایش <code dir="ltr">React</code> را تغییر نمی‌دهد. برای تجربهٔ فعلی ما **هر دو لازم‌اند**.

---

## ۱۰. <code dir="ltr">useEffect</code> چطور باعث بارگذاری خودکار می‌شود؟

در کامپوننت این کد را اضافه کردیم:

<div dir="ltr" align="left">

```tsx
const [isLoadingCollections, setIsLoadingCollections] = useState(true)

useEffect(() => {
  let cancelled = false

  const loadSavedCollections = async () => {
    try {
      const savedCollections = await loadCollectionsFromIndexedDB()

      if (!cancelled) {
        setCollections(savedCollections)
      }
    } catch (error) {
      console.error("Failed to load collections:", error)
    } finally {
      if (!cancelled) {
        setIsLoadingCollections(false)
      }
    }
  }

  void loadSavedCollections()

  return () => {
    cancelled = true
  }
}, [])
```

</div>

### <code dir="ltr">useEffect</code> چیست؟

یک ابزار <code dir="ltr">React</code> برای هماهنگ کردن کامپوننت با کارهای بیرونی است؛ مثلاً خواندن اطلاعات از دیتابیس مرورگر.

<div dir="ltr" align="left">

```tsx
useEffect(() => {
  // بارگذاری اطلاعات
}, [])
```

</div>

آرایهٔ خالی <code dir="ltr">[]</code> یعنی این <code dir="ltr">Effect</code> وابستگی متغیری ندارد و پس از نصب کامپوننت اجرا می‌شود. در حالت توسعه، <code dir="ltr">React Strict Mode</code> ممکن است برای بررسی کد آن را بیش از یک بار اجرا و پاک‌سازی کند؛ بنابراین نباید فرض کنیم در همهٔ شرایط دقیقاً یک مرتبه فراخوانی می‌شود.

### <code dir="ltr">loadSavedCollections</code>

یک تابع <code dir="ltr">async</code> داخلی است که کالکشن‌ها را می‌خواند و به <code dir="ltr">state</code> منتقل می‌کند.

### <code dir="ltr">try / catch / finally</code>

- <code dir="ltr">try</code>: کار اصلی را انجام بده.
- <code dir="ltr">catch</code>: اگر خطا رخ داد، آن را مدیریت کن.
- <code dir="ltr">finally</code>: چه موفق شد و چه خطا داد، کار پایانی را انجام بده.

در اینجا کار پایانی این است که وضعیت بارگذاری تمام شود:

<div dir="ltr" align="left">

```tsx
setIsLoadingCollections(false)
```

</div>

### <code dir="ltr">cancelled</code> و تابع برگشتی

اگر کاربر خیلی سریع صفحه را ترک کند و خواندن دیتابیس بعداً تمام شود، بهتر است اثر قدیمی وضعیت کامپوننتی را که دیگر فعال نیست تغییر ندهد.

<div dir="ltr" align="left">

```tsx
return () => {
  cancelled = true
}
```

</div>

این تابع، **پاک‌سازی (<code dir="ltr">cleanup</code>)** اثر است. قبل از پاک‌سازی، <code dir="ltr">cancelled</code> برابر <code dir="ltr">false</code> است؛ هنگام پاک‌سازی <code dir="ltr">true</code> می‌شود. توجه کن این کار خودِ درخواست <code dir="ltr">IndexedDB</code> را متوقف نمی‌کند؛ فقط مانع استفادهٔ آن اثر از نتیجهٔ دیررس می‌شود.

### چرا <code dir="ltr">void loadSavedCollections()</code> نوشته‌ایم؟

چون تابع <code dir="ltr">async</code> یک <code dir="ltr">Promise</code> برمی‌گرداند، اما خودِ تابعِ <code dir="ltr">useEffect</code> نباید یک <code dir="ltr">Promise</code> برگرداند. ما تابع داخلی را اجرا می‌کنیم و <code dir="ltr">void</code> فقط نشان می‌دهد خروجی <code dir="ltr">Promise</code> آن را در این نقطه استفاده نمی‌کنیم. **<code dir="ltr">void</code> منتظر عملیات نمی‌ماند و خطا را هم به‌تنهایی کنترل نمی‌کند**؛ مدیریت خطا داخل <code dir="ltr">try/catch</code> انجام شده است.

---

## ۱۱. هنگام <code dir="ltr">Import</code> دقیقاً چه اتفاقی می‌افتد؟

تابع اصلی انتخاب فایل این است:

<div dir="ltr" align="left">

```tsx
const handleCollectionFileChange = async (
  event: ChangeEvent<HTMLInputElement>,
) => {
  const file = event.target.files?.[0]
  event.currentTarget.value = ""

  if (!file) return

  try {
    const text = await file.text()
    const collection: unknown = JSON.parse(text)

    if (!isPostmanCollection(collection)) {
      console.error("Please select a valid Postman collection.")
      return
    }

    await saveCollectionToIndexedDB(collection)

    setCollections((previous) => [...previous, collection])

    console.log("Collection saved successfully!")
  } catch (error) {
    console.error("Failed to import collection:", error)
  }
}
```

</div>

به‌ترتیب بررسی کنیم:

**۱. <code dir="ltr">event</code>**: اطلاعات رویداد انتخاب فایل است.

**۲. <code dir="ltr">event.target.files?.[0]</code>**: نخستین فایل انتخاب‌شده را می‌گیرد. علامت <code dir="ltr">?.</code> کمک می‌کند اگر فهرست فایل‌ها وجود نداشت، خطای دسترسی به مقدارِ ناموجود نگیریم.

**۳. <code dir="ltr">event.currentTarget.value = ""</code>**: ورودی فایل را خالی می‌کند تا انتخاب مجدد همان فایل نیز بتواند رویداد تغییر را فعال کند.

**۴. <code dir="ltr">if (!file) return</code>**: اگر فایلی انتخاب نشده، اجرای تابع را متوقف کن.

**۵. <code dir="ltr">await file.text()</code>**: متن فایل را می‌خواند. حتی اگر فایل <code dir="ltr">JSON</code> باشد، در این مرحله نتیجه یک **رشتهٔ متنی** است.

**۶. <code dir="ltr">JSON.parse(text)</code>**: متن معتبر <code dir="ltr">JSON</code> را به مقدارهای قابل استفاده در <code dir="ltr">JavaScript</code>، مثل شیء و آرایه، تبدیل می‌کند. اگر متن از نظر ساختار <code dir="ltr">JSON</code> خراب باشد، خطا رخ می‌دهد و وارد <code dir="ltr">catch</code> می‌شویم.

**۷. <code dir="ltr">const collection: unknown</code>**: نوع <code dir="ltr">unknown</code> می‌گوید هنوز نمی‌دانیم دادهٔ خوانده‌شده واقعاً چیست؛ پس نباید بدون بررسی با آن مانند <code dir="ltr">PostmanCollection</code> رفتار کنیم.

**۸. <code dir="ltr">isPostmanCollection(collection)</code>**: یک بررسی اولیه انجام می‌دهد: داده شیء باشد، <code dir="ltr">info.name</code> و <code dir="ltr">info.schema</code> معتبر باشند و <code dir="ltr">item</code> آرایه باشد. این اعتبارسنجی **سطحی** است و همهٔ قسمت‌های داخلی یک فایل <code dir="ltr">Postman</code> را بررسی نمی‌کند.

**۹. <code dir="ltr">await saveCollectionToIndexedDB(collection)</code>**: ابتدا داده را در دیتابیس ذخیره کن. اگر خطا رخ دهد، ادامهٔ بخش <code dir="ltr">try</code> اجرا نمی‌شود و به <code dir="ltr">catch</code> می‌رویم.

**۱۰. <code dir="ltr">setCollections(...)</code>**: پس از موفقیت ذخیره، فهرست روی صفحه را به‌روز کن.

**۱۱. <code dir="ltr">console.log</code> و <code dir="ltr">console.error</code>**: پیام‌ها را در کنسول ابزار توسعهٔ مرورگر نشان می‌دهند؛ این پیام‌ها الزاماً به شکل اعلان در خود رابط کاربری دیده نمی‌شوند.

### چرا ترتیب مرحلهٔ ۹ و ۱۰ اهمیت دارد؟

اگر اول <code dir="ltr">setCollections</code> را اجرا کنیم و بعد ذخیره در دیتابیس خطا دهد، کاربر کالکشنی را در صفحه می‌بیند که شاید با تازه‌سازی صفحه ناپدید شود. در روش فعلی، **اول ذخیرهٔ موفق و سپس نمایش** اتفاق می‌افتد.

---

## ۱۲. <code dir="ltr">useRef</code> و دکمهٔ <code dir="ltr">Import</code> چه نقشی دارند؟

در این بخش:

<div dir="ltr" align="left">

```tsx
const collectionFileInputRef = useRef<HTMLInputElement>(null)
```

</div>

<code dir="ltr">useRef</code> یک مرجع قابل‌نگهداری می‌سازد. ما با آن می‌خواهیم از دکمهٔ ظاهریِ خودمان، ورودی مخفیِ انتخاب فایل را باز کنیم.

<div dir="ltr" align="left">

```tsx
const openCollectionFilePicker = () => {
  collectionFileInputRef.current?.click()
}
```

</div>

- <code dir="ltr">.current</code>: ارجاع فعلی به عنصر <code dir="ltr">input</code>.
- <code dir="ltr">?.click()</code>: اگر عنصر وجود دارد، مثل اینکه کاربر روی آن کلیک کرده، پنجرهٔ انتخاب فایل را باز کن.

ورودی مخفی:

<div dir="ltr" align="left">

```tsx
<input
  type="file"
  accept=".json"
  ref={collectionFileInputRef}
  hidden
  onChange={handleCollectionFileChange}
/>
```

</div>

<code dir="ltr">accept=".json"</code> فقط انتخاب فایل را در رابط کاربری محدود یا راهنمایی می‌کند؛ **اعتبارسنجی امنیتی نیست**. برای همین هنوز <code dir="ltr">JSON.parse</code> و <code dir="ltr">isPostmanCollection</code> لازم‌اند.

و دکمه:

<div dir="ltr" align="left">

```tsx
<Button
  onClick={openCollectionFilePicker}
  disabled={isLoadingCollections}
>
  Import Collection
</Button>
```

</div>

<code dir="ltr">disabled</code> در زمان بارگذاری اولیه مانع می‌شود کاربر هم‌زمان با خواندن اطلاعات قدیمی، دادهٔ جدید وارد کند و وضعیت صفحه به‌هم بریزد.

---

## ۱۳. کل ماجرا را با یک مثال واقعی دنبال کنیم

فرض کن برای اولین بار برنامه را روی آدرس <code dir="ltr">http://localhost:5173</code> اجرا می‌کنی.

### بار اول؛ بدون کالکشن ذخیره‌شده

1. صفحهٔ <code dir="ltr">Collections</code> باز می‌شود.
2. <code dir="ltr">useState([])</code> فهرست نمایشی را خالی می‌سازد.
3. <code dir="ltr">useEffect</code> تابع بارگذاری را اجرا می‌کند.
4. <code dir="ltr">openCollectionsDatabase</code> دیتابیس را باز می‌کند؛ اگر وجود نداشته باشد، آن را می‌سازد.
5. <code dir="ltr">getAll()</code> آرایهٔ خالی <code dir="ltr">[]</code> را برمی‌گرداند.
6. <code dir="ltr">setCollections([])</code> فهرست نمایشی را خالی نگه می‌دارد.
7. <code dir="ltr">isLoadingCollections</code> برابر <code dir="ltr">false</code> می‌شود و دکمهٔ وارد کردن فعال می‌شود.

### حالا یک فایل وارد می‌کنی

1. <code dir="ltr">Import Collection</code> را می‌زنی.
2. فایل <code dir="ltr">users.postman_collection.json</code> را انتخاب می‌کنی.
3. <code dir="ltr">file.text()</code> متن را می‌خواند.
4. <code dir="ltr">JSON.parse</code> آن را به شیء تبدیل می‌کند.
5. <code dir="ltr">isPostmanCollection</code> ساختار اولیه را بررسی می‌کند.
6. <code dir="ltr">saveCollectionToIndexedDB</code> آن را با <code dir="ltr">.add()</code> ذخیره می‌کند؛ مثلاً با کلید <code dir="ltr">1</code>.
7. <code dir="ltr">setCollections</code> همان شیء را به فهرست صفحه اضافه می‌کند.
8. <code dir="ltr">renderItems</code> پوشه‌ها و درخواست‌ها را نمایش می‌دهد.

### حالا کل صفحه را تازه‌سازی (<code dir="ltr">Refresh</code>) می‌کنی

1. حافظهٔ موقتِ کامپوننت از ابتدا ساخته می‌شود؛ پس <code dir="ltr">collections</code> ابتدا <code dir="ltr">[]</code> است.
2. <code dir="ltr">useEffect</code> دوباره درخواست بارگذاری می‌دهد.
3. <code dir="ltr">getAll()</code> رکورد ذخیره‌شده با کلید <code dir="ltr">1</code> را می‌خواند.
4. <code dir="ltr">setCollections(savedCollections)</code> آرایهٔ خوانده‌شده را در <code dir="ltr">state</code> قرار می‌دهد.
5. کالکشن دوباره نمایش داده می‌شود؛ بدون انتخاب دوبارهٔ فایل.

**این همان تفاوت اساسی بین ذخیره‌سازی پایدار در مرورگر و وضعیت موقت <code dir="ltr">React</code> است.**

---

## ۱۴. چطور داخل مرورگر ببینم اطلاعات کجا ذخیره شده‌اند؟

در <code dir="ltr">Chrome</code> یا <code dir="ltr">Edge</code>:

1. صفحهٔ برنامه را باز کن.
2. کلید <code dir="ltr">F12</code> را بزن.
3. به برگهٔ <code dir="ltr">Application</code> برو.
4. در بخش <code dir="ltr">Storage</code>، گزینهٔ <code dir="ltr">IndexedDB</code> را باز کن.
5. دیتابیس <code dir="ltr">postman-collections-db</code> را پیدا کن.
6. فروشگاه <code dir="ltr">collections</code> را انتخاب کن.
7. رکوردها را می‌بینی؛ معمولاً ستونی برای <code dir="ltr">Key</code> و ستونی برای <code dir="ltr">Value</code> وجود دارد.

ساختار مورد انتظار:

<div dir="ltr" align="left">

```text
Application
└── Storage
    └── IndexedDB
        └── postman-collections-db
            └── collections
                ├── Key: 1   Value: { info: ..., item: ... }
                └── Key: 2   Value: { info: ..., item: ... }
```

</div>

اگر چیزی نمی‌بینی، بررسی کن **همان آدرس سایت و همان پروفایل مرورگر** را باز کرده باشی.

### منظور از «همان آدرس سایت» چیست؟

<code dir="ltr">IndexedDB</code> بر اساس **مبدأ وب (<code dir="ltr">Origin</code>)** جدا می‌شود. مبدأ معمولاً ترکیب **پروتکل، دامنه/میزبان و پورت** است.

بنابراین این دو آدرس، مبدأهای متفاوتی دارند:

- <code dir="ltr">http://localhost:5173</code>
- <code dir="ltr">http://localhost:3000</code>

همچنین <code dir="ltr">http://localhost:5173</code> و <code dir="ltr">http://127.0.0.1:5173</code> یک مبدأ واحد محسوب نمی‌شوند؛ حتی اگر هر دو به یک کامپیوتر برسند.

پس ممکن است از یک آدرس کالکشن وارد کرده باشی ولی هنگام اجرای برنامه از آدرس دیگر، آن را نبینی. این الزاماً به معنی پاک شدن داده نیست.

---

## ۱۵. فرق <code dir="ltr">IndexedDB</code> با <code dir="ltr">localStorage</code> و دیتابیس سرور

| ویژگی | <code dir="ltr">React state</code> | <code dir="ltr">localStorage</code> | <code dir="ltr">IndexedDB</code> | دیتابیس سرور |
|---|---|---|---|---|
| محل اصلی | حافظهٔ برنامه در مرورگر | ذخیره‌سازی مرورگر | پایگاه دادهٔ مرورگر | سرور |
| ماندگاری بعد از تازه‌سازی | خیر، مگر دوباره بارگذاری شود | معمولاً بله | معمولاً بله | بله، طبق تنظیمات و نگهداری سرور |
| مناسب دادهٔ ساختاریافته و نسبتاً بزرگ | فقط برای وضعیت فعلی نمایش | معمولاً نه | بله | بله |
| نیاز به اینترنت برای دسترسی به دادهٔ ذخیره‌شده | خیر | خیر | خیر | بستگی به معماری دارد |
| به‌صورت خودکار بین دستگاه‌ها مشترک است | خیر | خیر | خیر | با پیاده‌سازی سمت سرور ممکن است |

چرا ما <code dir="ltr">IndexedDB</code> را انتخاب کردیم؟ چون یک فایل <code dir="ltr">Postman Collection</code> می‌تواند شیء بزرگ و تودرتو داشته باشد، و می‌خواهیم بدون نصب بسته یا راه‌اندازی سرور، آن را در مرورگر نگه داریم. <code dir="ltr">IndexedDB</code> می‌تواند شیءهای قابل ذخیره با الگوریتم <code dir="ltr">structured clone</code> را مستقیماً ذخیره کند؛ لازم نیست برای هر بار ذخیره آن‌ها را به رشتهٔ <code dir="ltr">JSON</code> تبدیل کنیم.

---

## ۱۶. معنی متدها و کلمه‌های مهم در یک نگاه

| دستور یا عبارت | کار آن در کد ما |
|---|---|
| <code dir="ltr">indexedDB.open(name, version)</code> | درخواست باز کردن یا ایجاد دیتابیس |
| <code dir="ltr">request.onupgradeneeded</code> | ساخت یا تغییر ساختار هنگام ایجاد اولیه یا ارتقای نسخه |
| <code dir="ltr">request.result</code> | گرفتن نتیجهٔ یک درخواست موفق |
| <code dir="ltr">db.objectStoreNames.contains(name)</code> | بررسی وجود <code dir="ltr">Object Store</code> |
| <code dir="ltr">db.createObjectStore(name, options)</code> | ساخت <code dir="ltr">Object Store</code> |
| <code dir="ltr">autoIncrement: true</code> | ایجاد کلید عددی خودکار برای رکورد جدید |
| <code dir="ltr">db.transaction(name, mode)</code> | شروع یک تراکنش روی یک فروشگاه |
| <code dir="ltr">transaction.objectStore(name)</code> | دسترسی به فروشگاه از داخل تراکنش |
| <code dir="ltr">.add(collection)</code> | اضافه کردن رکورد جدید |
| <code dir="ltr">.getAll()</code> | درخواست خواندن همهٔ مقدارهای رکوردها |
| <code dir="ltr">request.onsuccess</code> | واکنش به موفقیت درخواست |
| <code dir="ltr">request.onerror</code> | واکنش به خطای درخواست |
| <code dir="ltr">transaction.oncomplete</code> | واکنش به پایان موفق تراکنش |
| <code dir="ltr">transaction.onabort</code> | واکنش به لغو تراکنش |
| <code dir="ltr">db.close()</code> | بستن اتصالِ استفاده‌شده به دیتابیس |
| <code dir="ltr">new Promise(...)</code> | تبدیل رویدادهای بعدی به نتیجهٔ قابل انتظار با <code dir="ltr">await</code> |
| <code dir="ltr">resolve(...)</code> | مشخص کردن نتیجهٔ موفق <code dir="ltr">Promise</code> |
| <code dir="ltr">reject(...)</code> | مشخص کردن نتیجهٔ ناموفق <code dir="ltr">Promise</code> |
| <code dir="ltr">async</code> | اعلام تابع غیرهم‌زمان |
| <code dir="ltr">await</code> | انتظار برای نتیجهٔ <code dir="ltr">Promise</code> در تابع <code dir="ltr">async</code> |
| <code dir="ltr">file.text()</code> | خواندن فایل انتخابی به‌صورت متن |
| <code dir="ltr">JSON.parse(text)</code> | تبدیل متن <code dir="ltr">JSON</code> به مقدار <code dir="ltr">JavaScript</code> |
| <code dir="ltr">Array.isArray(item)</code> | بررسی اینکه <code dir="ltr">item</code> آرایه است |
| <code dir="ltr">useState</code> | نگهداری وضعیت نمایشی و به‌روزکردن رابط کاربری |
| <code dir="ltr">useEffect</code> | انجام کارهای بیرونی مانند بارگذاری داده پس از رندر |
| <code dir="ltr">useRef</code> | نگهداری ارجاع به عنصر <code dir="ltr">input</code> |
| <code dir="ltr">setCollections(...)</code> | به‌روزرسانی فهرست کالکشن‌ها در <code dir="ltr">React</code> |

---

## ۱۷. چند سؤال مهم که احتمالاً برایت پیش می‌آید

### آیا با بسته شدن مرورگر داده‌ها می‌مانند؟

در استفادهٔ معمول، **بله**؛ ولی مرورگر یا کاربر ممکن است داده‌های سایت را پاک کند. در حالت مرور خصوصی (<code dir="ltr">Incognito</code>/<code dir="ltr">Private</code>) نیز نباید روی ماندگاری پس از پایان جلسه حساب کنی.

### اگر فایل خراب باشد چه می‌شود؟

اگر <code dir="ltr">JSON</code> نامعتبر باشد، <code dir="ltr">JSON.parse</code> خطا می‌دهد. اگر از نظر ساختار اولیه شبیه کالکشن نباشد، تابع <code dir="ltr">isPostmanCollection</code> آن را رد می‌کند. در هر دو حالت، فایل نباید به مرحلهٔ ذخیره برسد.

### آیا همین اعتبارسنجی برای همهٔ فایل‌های <code dir="ltr">Postman</code> کافی است؟

خیر. اعتبارسنجی فعلی فقط چند شرط اولیه را بررسی می‌کند. برای کاربردهای دقیق‌تر، باید ساختار درونی درخواست‌ها و پوشه‌ها را نیز با یک <code dir="ltr">Schema</code> معتبر بررسی کنیم.

### چرا به‌جای <code dir="ltr">add()</code> از <code dir="ltr">put()</code> استفاده نکردیم؟

<code dir="ltr">add()</code> برای **ثبت رکورد جدید** است. <code dir="ltr">put()</code> می‌تواند رکورد را با کلید مشخص ثبت یا جایگزین کند. چون الان می‌خواهیم هر بار یک کالکشن جدید اضافه کنیم و کلیدها خودکارند، از <code dir="ltr">add()</code> استفاده کردیم. برای به‌روزرسانی همان کالکشن در آینده، طراحی کلید و شیوهٔ ذخیره مهم می‌شود؛ صرف عوض کردن <code dir="ltr">add</code> با <code dir="ltr">put</code> در ساختار فعلی، مشکل کالکشن تکراری را حل نمی‌کند.

### چرا فقط <code dir="ltr">IndexedDB</code> کافی نیست؟

دیتابیس کارِ **نگهداری** را انجام می‌دهد؛ <code dir="ltr">React state</code> کارِ **به‌روز نگه داشتن نمایش** را. در طراحی فعلی، اطلاعات را از دیتابیس می‌خوانیم و به <code dir="ltr">state</code> می‌دهیم تا کامپوننت‌ها آن را رندر کنند.

### چرا <code dir="ltr">getAll()</code> برای همیشه بهترین راه نیست؟

برای تعداد کم یا متوسط کالکشن‌ها ساده و مناسب است. اگر تعداد یا حجم داده‌ها خیلی زیاد شود، بهتر است فقط دادهٔ لازم را بخوانیم؛ مثلاً با کلید، ایندکس، <code dir="ltr">Cursor</code> یا روش‌های صفحه‌بندی.

### آیا <code dir="ltr">IndexedDB</code> اطلاعات را به سرور یا حساب کاربری می‌فرستد؟

خیر؛ خودِ این API داده‌ها را خودکار به هیچ سروری ارسال نمی‌کند. اگر بخواهی کالکشن‌ها بین دستگاه‌ها مشترک باشند، باید قابلیت همگام‌سازی یا بک‌اند جداگانه بسازی.

### آیا اطلاعات در <code dir="ltr">IndexedDB</code> امن‌اند؟

اطلاعات بر اساس قواعد مبدأ وب از سایت‌های نامرتبط جدا می‌شوند، اما <code dir="ltr">IndexedDB</code> **گاوصندوق رمزنگاری‌شدهٔ ویژهٔ اسرار نیست**. کد <code dir="ltr">JavaScript</code> همان مبدأ می‌تواند به داده‌ها دسترسی داشته باشد. از نگهداری رمز عبور، توکن حساس یا اطلاعات محرمانه در کالکشن بدون طراحی امنیتی مناسب پرهیز کن.

### اگر روی دکمهٔ <code dir="ltr">Import Collection</code> کلیک کنم و ذخیره شکست بخورد چه می‌شود؟

چون <code dir="ltr">await saveCollectionToIndexedDB(collection)</code> را قبل از <code dir="ltr">setCollections</code> گذاشته‌ایم، در صورت خطا کالکشن به فهرست نمایشی اضافه نمی‌شود. پیام خطا فعلاً فقط در <code dir="ltr">Console</code> ثبت می‌شود؛ در مرحلهٔ بعد می‌توانیم پیام قابل مشاهده برای کاربر اضافه کنیم.

---

## ۱۸. محدودیت‌ها و ایده‌های بهبود همین پروژه

پیاده‌سازی فعلی برای شروع مناسب است، اما هنوز ویژگی‌های زیر را ندارد:

1. **جلوگیری از کالکشن تکراری:** با <code dir="ltr">autoIncrement</code>، وارد کردن مجدد یک فایل رکورد جدید می‌سازد.
2. **حذف کالکشن:** چون فقط <code dir="ltr">getAll()</code> می‌خوانیم، کلیدهای ذخیره‌سازی را همراه دادهٔ نمایشی نگه نمی‌داریم.
3. **ویرایش و ذخیرهٔ تغییرات:** برای این کار به کلید پایدار یا شناسهٔ مناسب و یک مسیر به‌روزرسانی نیاز داریم.
4. **جست‌وجوی بهینه در حجم زیاد:** اکنون تمام کالکشن‌ها با <code dir="ltr">getAll()</code> در حافظه بارگذاری می‌شوند.
5. **نمایش خطا به کاربر:** به‌جای فقط <code dir="ltr">console.error</code> می‌توانیم پیام خطا در خود صفحه نمایش دهیم.
6. **پشتیبان‌گیری و همگام‌سازی:** اطلاعات در مرورگر فعلی هستند و به شکل خودکار به دستگاه دیگری منتقل نمی‌شوند.
7. **اعتبارسنجی کامل‌تر:** بررسی فعلی، یک اعتبارسنجی اولیه از قالب فایل است.

این‌ها **اشکال ضروری در کد فعلی نیستند**؛ مراحل طبیعی رشد یک برنامه‌اند.

---

## ۱۹. تمرین‌های کوچک برای مطمئن شدن از یادگیری

**تمرین اول: تفاوت ذخیره و نمایش**  
در ذهن خودت جواب بده: اگر فقط <code dir="ltr">setCollections(...)</code> اجرا شود ولی <code dir="ltr">saveCollectionToIndexedDB(...)</code> را حذف کنیم، بعد از <code dir="ltr">Refresh</code> چه اتفاقی می‌افتد؟

**پاسخ:** کالکشن جدید پس از تازه‌سازی برنمی‌گردد؛ چون نسخه‌ای در دیتابیس ذخیره نشده است.

**تمرین دوم: خواندن از دیتابیس**  
اگر سه کالکشن در فروشگاه وجود داشته باشد، نتیجهٔ <code dir="ltr">getAll()</code> چه نوع مقداری است؟

**پاسخ:** یک درخواست غیرهم‌زمان که پس از موفقیت، مقدار آن آرایه‌ای با سه شیء کالکشن است.

**تمرین سوم: تراکنش‌ها**  
برای فهرست کردن کالکشن‌ها از <code dir="ltr">readonly</code> استفاده کنیم یا <code dir="ltr">readwrite</code>؟

**پاسخ:** <code dir="ltr">readonly</code>، چون چیزی را تغییر نمی‌دهیم.

**تمرین چهارم: نسخهٔ دیتابیس**  
آیا بعد از وارد کردن کالکشن دوم باید <code dir="ltr">DB_VERSION</code> را از <code dir="ltr">1</code> به <code dir="ltr">2</code> تغییر دهیم؟

**پاسخ:** خیر؛ نسخه برای **تغییر ساختار دیتابیس** است، نه افزایش تعداد داده‌ها.

**تمرین پنجم: کلیدها**  
با <code dir="ltr">autoIncrement: true</code> و <code dir="ltr">add()</code>، اگر همان فایل را دو بار وارد کنیم، رکورد دوم چه می‌شود؟

**پاسخ:** یک رکورد جدید با کلید عددی متفاوت ایجاد می‌شود؛ چون تشخیص تکراری بودن هنوز پیاده‌سازی نشده است.

---

## ۲۰. جمع‌بندی نهایی

این پنج جمله را اگر خوب بفهمی، قسمت اصلی کار را یاد گرفته‌ای:

1. **<code dir="ltr">IndexedDB</code> محل نگهداری داده در مرورگر است.**
2. **<code dir="ltr">openCollectionsDatabase</code> دیتابیس را باز می‌کند و در صورت نیاز ساختار اولیه‌اش را می‌سازد.**
3. **<code dir="ltr">saveCollectionToIndexedDB</code> با یک تراکنش <code dir="ltr">readwrite</code> و متد <code dir="ltr">add()</code> داده را ذخیره می‌کند.**
4. **<code dir="ltr">loadCollectionsFromIndexedDB</code> با یک تراکنش <code dir="ltr">readonly</code> و متد <code dir="ltr">getAll()</code> داده را می‌خواند.**
5. **<code dir="ltr">React state</code> داده را روی صفحه نمایش می‌دهد و <code dir="ltr">useEffect</code> بعد از باز شدن صفحه، دادهٔ ذخیره‌شده را به آن برمی‌گرداند.**

به بیان خیلی ساده:

> **<code dir="ltr">IndexedDB</code> = نگهداری اطلاعات**  
> **<code dir="ltr">React state</code> = وضعیت فعلیِ صفحه**  
> **<code dir="ltr">Promise</code> و <code dir="ltr">await</code> = هماهنگ کردن کارهای زمان‌بر**  
> **<code dir="ltr">Transaction</code> = مدیریت خواندن یا نوشتن در دیتابیس**

وقتی این چهار مفهوم را از هم تشخیص بدهی، اضافه کردن امکانات بعدی مانند **حذف، ویرایش، تشخیص تکراری بودن و جست‌وجو** بسیار راحت‌تر می‌شود.

---

### منابع برای مطالعهٔ بیشتر

- [راهنمای <code dir="ltr">IndexedDB</code> در <code dir="ltr">MDN</code>](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [مرجع <code dir="ltr">IDBDatabase</code>](https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase)
- [مرجع <code dir="ltr">IDBTransaction</code>](https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction)
- [مرجع <code dir="ltr">IDBObjectStore.add()</code>](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/add)
- [مرجع <code dir="ltr">IDBObjectStore.getAll()</code>](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAll)
- [مستندات <code dir="ltr">useEffect</code> در <code dir="ltr">React</code>](https://react.dev/reference/react/useEffect)

*پایان راهنما — بر اساس پیاده‌سازی واقعی صفحهٔ <code dir="ltr">Collections</code> در پروژهٔ شما.*

</div>
