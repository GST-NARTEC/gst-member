pipeline {
    agent any

    environment {
        ENV_FILE_PATH = "C:\\ProgramData\\Jenkins\\.jenkins\\jenkinsEnv\\GST\\gst-member"
        NODE_ENV = 'development'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']],
                    extensions: [],
                    userRemoteConfigs: [[
                        credentialsId: 'Wasim-Jenkins-Credentials',
                        url: 'https://github.com/GST-NARTEC/gst-member.git'
                    ]],
                )
            }
        }


        stage('Setup Environment') {
            steps {
                echo "📁 Setting up environment file..."
                bat "copy \"${ENV_FILE_PATH}\" \"%WORKSPACE%\\.env\""
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies for GST Member..."
                bat 'npm ci'
            }
        }

        stage('Generate Build') {
            steps {
                echo "Generating build for GST Member..."
                bat 'npm run build'
            }
        }

        stage('Create web.config') {
            steps {
                script {
                    def webConfigContent = '''<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Router" stopProcessing="true">
          <match url="^(?!.*\\.\\w{2,4}$)(.*)$" />
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>'''
                    writeFile(file: 'dist/web.config', text: webConfigContent)
                }
            }
        }
    }

    post {
        success {
            echo "✅ GST Member build completed successfully!"
        }
        
        failure {
            echo "❌ GST Member build failed!"
        }
    }
}