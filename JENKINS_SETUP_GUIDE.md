# জেনকিন্স ও জিসিপি সিআই/সিডি সেটআপ গাইড (Jenkins & GCP CI/CD Setup Guide)

এই গাইডটি অনুসরণ করে আপনি খুব সহজেই আপনার জেনকিন্স (Jenkins) সার্ভারকে গুগল ক্লাউড প্ল্যাটফর্মের (GCP) সাথে অথেন্টিকেট করতে পারবেন যাতে কোড পুশ করলেই স্বয়ংক্রিয়ভাবে ক্লাউড রানে প্রজেক্ট ডেপ্লয় হয়ে যায়। (Follow this guide to authenticate Jenkins with GCP and automate your Cloud Run deployments.)

---

## ধাপ ১: জিসিপি সার্ভিস অ্যাকাউন্ট তৈরি করা (Step 1: Create GCP Service Account)

১. **Google Cloud Console**-এ যান।
২. **IAM & Admin > Service Accounts** মেন্যুতে প্রবেশ করুন।
৩. উপরে থাকা **"+ CREATE SERVICE ACCOUNT"** বাটনে ক্লিক করুন।
৪. সার্ভিস অ্যাকাউন্টের একটি নাম দিন (যেমন: `jenkins-deployer`) এবং **"CREATE AND CONTINUE"**-এ ক্লিক করুন।
৫. সার্ভিস অ্যাকাউন্টকে নিচের রোলগুলো (Roles) দিন:
   - **Cloud Build Editor** (`roles/cloudbuild.builds.editor`) - ক্লাউডে ইমেজ বিল্ড করার জন্য।
   - **Cloud Run Developer** (`roles/run.developer`) - ক্লাউড রানে নতুন রিভিশন ডেপ্লয় করার জন্য।
   - **Storage Admin** (`roles/storage.admin`) - ক্লাউড স্টোরেজে সোর্স ফাইল ও লগ রাখার জন্য।
   - **Service Account User** (`roles/iam.serviceAccountUser`) - ক্লাউড রান সার্ভিস রান করার পারমিশন দেওয়ার জন্য।
৬. **"DONE"** বাটনে ক্লিক করে সার্ভিস অ্যাকাউন্ট তৈরি সম্পন্ন করুন।

---

## ধাপ ২: JSON কী ফাইল ডাউনলোড করা (Step 2: Download the JSON Key File)

১. তৈরি করা সার্ভিস অ্যাকাউন্টটির ইমেইল এড্রেসের উপর ক্লিক করুন।
২. উপরে থাকা **"KEYS"** ট্যাবে ক্লিক করুন।
৩. **"ADD KEY > Create new key"** বাটনে ক্লিক করুন।
৪. কী-টাইপ **"JSON"** সিলেক্ট রেখে **"CREATE"** বাটনে ক্লিক করুন।
৫. একটি `.json` ফাইল আপনার কম্পিউটারে ডাউনলোড হবে। এই ফাইলটি অত্যন্ত গোপনীয় এবং নিরাপদ স্থানে রাখুন।

---

## ধাপ ৩: জেনকিন্সে ক্রেডেনশিয়াল যুক্ত করা (Step 3: Add Credentials in Jenkins)

১. আপনার **Jenkins Dashboard**-এ প্রবেশ করুন।
২. বাম পাশের মেন্যু থেকে **Manage Jenkins > Credentials**-এ যান।
৩. আপনার গ্লোবাল ডোমেইনে গিয়ে **"+ Add Credentials"**-এ ক্লিক করুন।
৪. নিচের অপশনগুলো সিলেক্ট করুন:
   - **Kind:** `Secret file`
   - **Scope:** `Global`
   - **File:** আপনার জিসিপি থেকে ডাউনলোড করা `.json` কী ফাইলটি আপলোড করুন।
   - **ID:** `gcp-service-account-key` (এটি হুবহু লিখবেন, কারণ Jenkinsfile-এ এই আইডিটি ব্যবহার করা হয়েছে)।
   - **Description:** `GCP Service Account JSON Key`
৫. **"Create"** বাটনে ক্লিক করে ক্রেডেনশিয়ালটি সেভ করুন।

---

## ধাপ ৪: জেনকিন্স পাইপলাইন প্রজেক্ট তৈরি (Step 4: Create Jenkins Pipeline Job)

১. জেনকিন্স ড্যাশবোর্ড থেকে **"New Item"**-এ ক্লিক করুন।
২. প্রজেক্টের নাম দিন এবং **"Pipeline"** সিলেক্ট করে **"OK"** চাপুন।
৩. কনফিগারেশন পেজের একদম নিচে **Pipeline** সেকশনে যান:
   - **Definition:** `Pipeline script from SCM` সিলেক্ট করুন।
   - **SCM:** `Git` সিলেক্ট করুন এবং আপনার গিট রিপোজিটরি ইউআরএল (Repository URL) প্রদান করুন।
   - **Credentials:** আপনার গিট ক্লায়েন্ট অথেন্টিকেশন ক্রেডেনশিয়াল সিলেক্ট করুন।
   - **Script Path:** `Jenkinsfile` (এটি ডিফল্ট হিসেবে দেওয়াই থাকে)।
৪. **"Save"** বাটনে ক্লিক করুন।

এখন যখনই আপনি গিটহাবে কোড পুশ করবেন বা জেনকিন্সে **"Build Now"** বাটনে ক্লিক করবেন, সম্পূর্ণ পাইপলাইনটি স্বয়ংক্রিয়ভাবে রান করবে এবং জিসিপি ক্লাউড রানে আপনার পোর্টাল আপডেট করে দেবে!
