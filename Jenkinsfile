pipeline {
    agent any
    environment {
        ENV_FILE_PATH = "C:\\ProgramData\\Jenkins\\.jenkins\\jenkinsEnv\\GST\\gst-member\\.env"
    }
    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '5', daysToKeepStr: '', numToKeepStr: '5')
    }
    stages {
        stage('Checkout') {
            steps {
                echo "📦 Cloning FireWatch Admin repository..."
                checkout scmGit(
                    branches: [[name: '*/main']], 
                    extensions: [], 
                    userRemoteConfigs: [[
                        credentialsId: 'Wasim-Jenkins-Credentials',
                        url: 'https://github.com/GST-NARTEC/gst-member.git'
                    ]]
                )
            }
        }
        stage('Setup Environment File') {
            steps {
                echo "📁 Copying .env file to the frontend root..."
                bat "copy \"${ENV_FILE_PATH}\" \"%WORKSPACE%\\.env\""
            }
        }
        stage('Install & Build Frontend') {
            steps {
                echo "📦 Installing dependencies..."
                bat 'npm install'
                echo "🔨 Building React Vite application..."
                bat 'npm run build'
                echo "📋 Ensuring web.config is in build output..."
                bat 'if not exist "dist\\web.config" copy "public\\web.config" "dist\\web.config"'
            }
        }
    }
}
