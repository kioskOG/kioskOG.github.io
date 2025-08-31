from flask import Flask, request
import os
from emailNotify import emailnotify
from jinja2 import Environment, FileSystemLoader

server = Flask(__name__)

@server.route('/api/v1/notify/register', methods=['POST'])
def registerNotifyFunc():
    returnVar = {}
    try:
        UserNameVar = request.json["username"]
        emailVar = request.json["email"]
    except KeyError:
        returnVar = {
            'Error': 'Wrong character'
        }
        return returnVar, 403

    returnVar["Email"] = emailVar

    templateInput = {
        'sqlQueryResultUserName': UserNameVar,
    }
    file_loader = FileSystemLoader('templates')
    env = Environment(loader=file_loader)
    template = env.get_template('register.html')
    renderEmailTemplate = template.render(templateInput=templateInput)

    emailNotifyReturnVar = emailnotify.emailNotification(
        emailSubject="Register Subject",
        recipientEmail=returnVar["Email"],
        emailBody=renderEmailTemplate
        )

    returnVar["msg"] = emailNotifyReturnVar["msg"]
    returnVar["code"] = emailNotifyReturnVar["code"]

    return returnVar, 200

@server.route('/api/v1/notify/login', methods=['POST'])
def loginNotifyFunc():
    returnVar = {}
    try:
        userNameVar = request.json["Username"]
        emailVar = request.json["Email"]
    except KeyError:
        returnVar = {
            'Error': 'Wrong character'
        }
        return returnVar, 403

    returnVar["Email"] = emailVar
    returnVar["Username"] = userNameVar

    templateInput = {
        'sqlQueryResultUserName': userNameVar,
    }
    file_loader = FileSystemLoader('templates')
    env = Environment(loader=file_loader)
    template = env.get_template('login.html')
    renderEmailTemplate = template.render(templateInput=templateInput)

    emailNotifyReturnVar = emailnotify.emailNotification(
        emailSubject="Login Subject",
        recipientEmail=returnVar["Email"],
        emailBody=renderEmailTemplate
        )

    returnVar["msg"] = emailNotifyReturnVar["msg"]
    returnVar["code"] = emailNotifyReturnVar["code"]

    return returnVar, 200

@server.route('/api/v1/notify/allurl', methods=['POST'])
def reportAllUrlNotifyFunc():
    returnVar = {}
    try:
        emailVar = request.json["Email"]
        firstNameVar = request.json["FirstName"]
        lastNameVar = request.json["LastName"]
        dataVar = request.json["Data"]
    except KeyError:
        returnVar = {
            'Error': 'Wrong character'
        }
        return returnVar, 403

    templateInput = {
        'dataVar': dataVar,
        'firstNameVar': firstNameVar,
        'lastNameVar': lastNameVar
    }

    file_loader = FileSystemLoader('templates')
    env = Environment(loader=file_loader)
    template = env.get_template('url_visitors.html')
    renderEmailTemplate = template.render(templateInput=templateInput)

    emailNotifyReturnVar = emailnotify.emailNotification(
        emailSubject="All URL Report",
        recipientEmail=emailVar,
        emailBody=renderEmailTemplate
        )

    returnVar["msg"] = emailNotifyReturnVar["msg"]
    returnVar["code"] = emailNotifyReturnVar["code"]

    return returnVar, 200

@server.route('/api/v1/notify/s/<shorturl>', methods=['POST'])
def reportSingleUrlNotifyFunc(shorturl):
    returnVar = {}
    shortUrlVar = shorturl
    try:
        emailVar = request.json["Email"]
        firstNameVar = request.json["FirstName"]
        lastNameVar = request.json["LastName"]
        dataVar = request.json["Data"]
    except KeyError:
        returnVar = {
            'Error': 'Wrong character'
        }
        return returnVar, 403

    templateInput = {
        'shortUrlVar' : shortUrlVar,
        'dataVar': dataVar,
        'firstNameVar': firstNameVar,
        'lastNameVar': lastNameVar
    }

    file_loader = FileSystemLoader('templates')
    env = Environment(loader=file_loader)
    template = env.get_template('url_info.html')
    renderEmailTemplate = template.render(templateInput=templateInput)

    emailNotifyReturnVar = emailnotify.emailNotification(
        emailSubject=f"{shorturl} info",
        recipientEmail=emailVar,
        emailBody=renderEmailTemplate
        )

    returnVar["msg"] = emailNotifyReturnVar["msg"]
    returnVar["code"] = emailNotifyReturnVar["code"]

    return returnVar, 200

if __name__ == "__main__":
    server.run(host="0.0.0.0", debug=True, port=5000)
    
