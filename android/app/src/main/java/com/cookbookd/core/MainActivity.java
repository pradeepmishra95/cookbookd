package com.cookbookd.core;


import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.os.Bundle;
import com.proyecto26.inappbrowser.RNInAppBrowserModule;
import java.util.List;
import com.facebook.react.ReactPackage;


public class MainActivity extends ReactActivity {

 @Override
 protected String getMainComponentName() {
   return "cookbookd";
 }


 @Override
 protected ReactActivityDelegate createReactActivityDelegate() {
   return new DefaultReactActivityDelegate(
       this,
       getMainComponentName(),
       DefaultNewArchitectureEntryPoint.getFabricEnabled());
 }

 @Override
 protected void onCreate(Bundle savedInstanceState) {
   super.onCreate(null);
 }

 @Override
 protected void onStart() {
   super.onStart();
   RNInAppBrowserModule.onStart(this);
 }
}
