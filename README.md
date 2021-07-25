# Pushover Notify
Pushover Notifications for Github Actions

## Inputs
`pushoverUser`: Pushover User Token. Required. \
`pushoverApp`: Pushover Application Token. Required. \
`details`: Additional text after notification. \
`device`: Device name to send notifications to. \
`title`: Message title. \
`sound`: Notification sound. \
`url`: A URL to include in your message. \
`url_title`: A title for your url. \
`priority`: Notification priority. Available priorities: (-2, -1, 0, 1, 2). If priority is 2, retries and expire field must be given. \
`retries`: The retry parameter specifies how often (in seconds) the Pushover servers will send the same notification to the user. (From Pushover Docs) \
`expire`: The expire parameter specifies how many seconds your notification will continue to be retried for every retry seconds. (From Pushover Docs)\
\
More info on: https://pushover.net/api

## Usage Example

```
- name: Test Success
    uses: niniyas/pushover-notify@master
    if: success()
    with:
        details: Test Succeeded!
        pushoverUser: ${{ secrets.PUSHOVER_USER }}
        pushoverApp: ${{ secrets.PUSHOVER_APP }}
- name: Test Failure
    uses: niniyas/pushover-notify@master
    if: failure()
    with:
        details: Test Failed!
        priority: 1
        pushoverUser: ${{ secrets.PUSHOVER_USER }}
        pushoverApp: ${{ secrets.PUSHOVER_APP }}
- name: Test Cancelled
    uses: niniyas/pushover-notify@master
    if: cancelled()
    with:
        details: Test Cancelled!
        pushoverUser: ${{ secrets.PUSHOVER_USER }}
        pushoverApp: ${{ secrets.PUSHOVER_APP }}
```
