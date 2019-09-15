import 'package:flutter/material.dart';
import 'package:http/http.dart';
void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter login UI',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;
  


  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  TextStyle style = TextStyle(fontFamily: 'Montserrat', fontSize: 20.0);
  final emailController = TextEditingController();
  final passController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final emailField = TextField(
      controller: emailController,
      obscureText: false,
      style: style,
      decoration: InputDecoration(
        contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        hintText: "Email",
        border:
          OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
    );
    
    final passwordField = TextField(
      controller: passController,
      obscureText: true,
      style: style,
      decoration: InputDecoration(
        contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        hintText: "Password",
        border:
          OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
    );
  String serverResponse = 'Server response';
  String _serverLogin(String username, String password) {
    return 'http://10.195.146.190:3000/login/'+ username +'/'+ password;
  }
  String _serverNewUserUrl(String username, String password) {
    return 'http://10.195.146.190:3000/newUser/'+ username +'/'+ password;
  }

  _sendLogin(String username, String password) async {
      print(_serverLogin(username,password));
    Response response = await get(_serverLogin(username, password));
    setState(() {
      print(response.body);
      //Change to  another page
      Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => SecondRoute()),
            );
      serverResponse = response.body;
    });
  }

  _serverNewUser(String username, String password) async {
      print(_serverNewUserUrl(username,password));
    Response response = await post(_serverNewUserUrl(username, password));
    setState(() {
      print(response.body);
      serverResponse = response.body;
    });
  }
    final loginButon = Material(
      elevation: 5.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Color(0xff01A0C7),
      child: MaterialButton(
        minWidth: MediaQuery.of(context).size.width,
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed:(){ _sendLogin(emailController.text,passController.text);},
        /*() {
          return showDialog(
            
            context: context,
            builder: (context) {
              return AlertDialog(
              // Retrieve the text the user has entered by using the
              // TextEditingController.
                content: Text(emailController.text + passController.text),
              );
            },
          );
        },*/
        child: Text("Login",
          textAlign: TextAlign.center,
          style: style.copyWith(
            color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    
  
    

    final signUpButon = Material(
      elevation: 5.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Color(0xff01A0C7),
      child: MaterialButton(
        minWidth: MediaQuery.of(context).size.width,
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed: () {_serverNewUser(emailController.text,passController.text);
          
        },
        child: Text("Sign up with email",
          textAlign: TextAlign.center,
          style: style.copyWith(
            color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    
    
    return Scaffold(
      body: Center(
        child: Container(
          color: Colors.white,
          child: Padding(
            padding: const EdgeInsets.all(36.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                SizedBox(
                  height: 155.0,
                  child: Image.asset(
                    "assets/logo.png",
                    fit: BoxFit.contain,
                  ),
                ),
                SizedBox(height: 45.0),
                emailField,
                SizedBox(height: 25.0),
                passwordField,
                SizedBox(
                  height: 35.0,
                ),
                loginButon,
                SizedBox(
                  height: 15.0,
                ),
                SizedBox(
                  height: 15.0,

                ),
                signUpButon,
              ],
            ),
          ),
        ),
      ),
    );
  }
}
class SecondRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Second Route"),
      ),
      body: Center(
        child: RaisedButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: Text('Go back!'),
        ),
      ),
    );
  }
}
