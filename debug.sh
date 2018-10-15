#!/bin/bash

cat > .debug <<EOL
<?xml version="1.0" encoding="UTF-8"?>
<ExtensionList>
    <Extension Id="com.petridamsten.somnium.panel">
        <HostList>
            <!-- Photoshop -->
            <Host Name="PHXS" Port="8088"/>
        </HostList>
    </Extension>
</ExtensionList>
EOL

defaults write com.adobe.CSXS.8 PlayerDebugMode 1
defaults write com.adobe.CSXS.8 LogLevel 6 && killall -u `whoami` cfprefsd
defaults write com.adobe.CSXS.9 PlayerDebugMode 1
defaults write com.adobe.CSXS.9 LogLevel 6 && killall -u `whoami` cfprefsd
