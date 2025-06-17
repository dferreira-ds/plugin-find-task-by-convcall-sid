import React from 'react';
import { Alert } from '@twilio-paste/core/alert';
import { Theme } from '@twilio-paste/core/theme';
import { Text } from '@twilio-paste/core/text';

const Notification = ({ text, isOpen, setIsOpen }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <Theme.Provider theme="default">
            <Alert onDismiss={() => setIsOpen(false)} variant="warning">
                <Text>
                    {text}
                </Text>
            </Alert>
        </Theme.Provider>
    )
};

export default Notification;