#!/usr/bin/env groovy
//to import from another groovy file use below example
  //def grScript = load "functions.groovy"
  //and access methods by 
  //grScript.functionname()

pipeline{
    agent { node {label 'jobs_all'}} //you can specify agent as any like "agent any"

    //tools for building projects
    //supported build tools are maven, gradle, jdk
    tools{
        maven 'mymaven' //mymaven is the name configured in global tool config in jenkins
    }

    //environment variables - defined in this block outside of stage is 
    //accessible to all stages - global
    environment{
        BUILD_NUMBER = "1.0.0" //Jenkins provided variable example
        server_cred = credentials('dummycredentials') //dummycredentials is the credentials ID coming from jenkins credentials manager
    }

    //parameterization
    parameters{
        //types of parameterization are:
        // string(name, defaultValue, description) OR
        //choice(name, description, choices:['1', '2']) - shown in action below
        //booleanParam(name, defaultValue, description)

        choice( 
            choices : ['npm', 'maven'],
            description: 'to do npm install only when a condition is met',
            name: 'REQUESTED_ACTION'
        )
    }
    
    //trigger the build once manually for below cron to take effect
    triggers{
        //triggers to pollSCM every 5 mins on 2nd half of every hour 
        //below line commented on purpose not to trigger 
        
        //cron('H(30-59)/5 * * * *')

        //below cron triggers every 3 hrs between 9am and 5pm on weekdays only
        cron('H H(9-16)/3 * * 1-5')
    }

    //time out the whole pipeline if it is more than 1 mins
    options{
        timeout(time: 15, unit: 'MINUTES') //unit can be seconds, hours etc. default mins
    }
    stages{
        //commenting below stage as it is redundant
        /* stage('Git checkout'){
            steps{
                echo 'Checkout code from github repo'
                echo "user defined env var is ${server_cred_USR}"
                git branch: 'master', url: 'https://github.com/mailtwogopal/nodejs-api.git'
            } 
        }*/
        stage('SSH EC2 & setup git'){
            steps{
            sh "sudo chmod 400 /home/gopalakrishnan/Downloads/node-server.pem"
            sh "ssh -i /home/gopalakrishnan/Downloads/node-server.pem ec2-user@ec2-107-23-241-152.compute-1.amazonaws.com"
            sh "sudo yum update -y"
            sh "sudo yum install git -y"
            sh "git --version"
            }
        }
        stage('Install node in EC2'){
            steps{
            sh "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash"
            sh ". ~/.nvm/nvm.sh"
            sh "nvm install node"
            sh "node -v"
            sh "npm -v"
            }
        }
        stage('clone repository in ec2'){
            steps{
            sh "git clone https://github.com/mailtwogopal/nodejs-api.git"
            sh "cd nodejs-api"
            }
        }
        stage('Install Dependencies'){
            when{
                //one expression is required inside when
                expression {params.REQUESTED_ACTION == 'npm' }
            } //when ends here
                    steps{
                        withCredentials([
                            usernamePassword(credentialsId: 'dummycredentials', 
                            usernameVariable: 'user', //assigning username to variable user
                            passwordVariable: 'password') //assigning password to variable password
                        ]){
                            echo "inside withCredentials: ${user}"
                        }
                        echo "Build number is ${BUILD_NUMBER}"
                        echo 'Installing dependencies'
                        sh "npm install"
            }
            
        }
        stage('Build and Deploy'){
            steps{
                parallel(  //parallel tasks within steps
                    "taskone" : {
                        script{
                            def buildnumber = 1
                            echo "Build number hardcoded is : ${buildnumber}"                          
                        }
                    },
                    "tasktwo" : {
                        script{
                            try{
                                retry(3){ //retrying this step for 3 times
                                    echo "within retry"
                                    sh "npm start"
                                }
                            }
                            catch(err){
                                currentBuild.result = "FAILURE"
                                echo "Error caught is : ${err}"
                            }  
                        }                                 
                    }
                )
            }
        }
        stage('Test'){
            steps{
            sh "curl 107.23.241.152:4200/ping"
            }
        }
    }//end of stages
    post{
        always{
            echo 'This will run irrespective of build status'
        }
        success{
            echo 'This msg will show only when build is successful'
        }
        failure{
            echo 'This will show when build is failed'
        }
        unstable{
            echo 'unstable state due to code violation, other causes'
        }
        changed{
            echo 'This will run when current pipeline running at diff state from previous pipeline'
        }
    }
}