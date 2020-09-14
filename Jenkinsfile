#!/usr/bin/env groovy
pipeline{
    agent { node {label 'jobs_all'}} //you can specify agent as any like agent any
    stages{
        stage('Git checkout'){
            steps{
                echo 'Checkout code from github repo'
                git branch: 'master', url: 'https://github.com/mailtwogopal/nodejs-api.git'
            }
        }
        stage('Install Dependencies'){
            steps{
                echo 'Installing dependencies'
                sh "npm install"
            }
        }
        stage('Build'){
            steps{
                parallel(
                    "TaskOne" : {
                        def buildnumber = 1
                        echo "Build number hardcoded is : ${buildnumber}"
                    },
                    "TaskTwo" : {
                        try{
                            sh "npm run build"
                        }
                        catch(err){
                              echo "Error caught is : ${err}"
                }

                    }
                )
            }
        }
    }
}