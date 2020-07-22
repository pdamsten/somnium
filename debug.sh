#!/bin/bash

# remove extension installed from the cloud
rm -fR /Library/Application\ Support/Adobe/CEP/extensions/com.petridamsten.somnium
# link to home dir
ln -nsf "$(pwd)" ~/Library/Application\ Support/Adobe/CEP/extensions/com.petridamsten.somnium

cat > .debug <<EOL
<?xml version="1.0" encoding="UTF-8"?>
<ExtensionList>
    <Extension Id="com.petridamsten.somnium.panel">
        <HostList>
            <!-- Photoshop -->
            <Host Name="PHXS" Port="8000"/>
        </HostList>
    </Extension>
    <Extension Id="com.petridamsten.somnium.dialog">
        <HostList>
            <!-- Photoshop -->
            <Host Name="PHXS" Port="8100"/>
        </HostList>
    </Extension>
</ExtensionList>
EOL

defaults write com.adobe.CSXS.8 PlayerDebugMode 1
defaults write com.adobe.CSXS.8 LogLevel 6 && killall -u `whoami` cfprefsd
defaults write com.adobe.CSXS.9 PlayerDebugMode 1
defaults write com.adobe.CSXS.9 LogLevel 6 && killall -u `whoami` cfprefsd
defaults write com.adobe.CSXS.10 PlayerDebugMode 1
defaults write com.adobe.CSXS.10 LogLevel 6 && killall -u `whoami` cfprefsd
