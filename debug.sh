#!/bin/bash
defaults write com.adobe.CSXS.8 PlayerDebugMode 1
defaults write com.adobe.CSXS.8 LogLevel 6 && killall -u `whoami` cfprefsd
