pipeline {
    agent any

    environment {
        PROJECT_ID = 'gmail-and-telegram-480114'
        REGION = 'us-central1'
        CREDENTIALS_ID = 'gcp-service-account-key'
        IMAGE_NAME = 'us-central1-docker.pkg.dev/gmail-and-telegram-480114/student-services/main-portal:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('GCP Auth') {
            steps {
                withCredentials([file(credentialsId: "${CREDENTIALS_ID}", variable: 'GCP_KEY_FILE')]) {
                    bat 'gcloud auth activate-service-account --key-file="%GCP_KEY_FILE%"'
                    bat 'gcloud config set project %PROJECT_ID%'
                }
            }
        }

        stage('Build & Push') {
            steps {
                bat 'gcloud builds submit --tag %IMAGE_NAME% --no-logs-streaming .'
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                bat 'gcloud run deploy main-portal --image=%IMAGE_NAME% --platform=managed --region=%REGION% --set-env-vars="SUPABASE_URL=https://lepbljtyhscjcaoveiom.supabase.co,SUPABASE_ANON_KEY=sb_publishable_b-CQ-g2GArhGl02qFMp56Q_ARFadUQG" --allow-unauthenticated'
            }
        }

    }
}
