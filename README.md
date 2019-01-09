# dailybot

In December 2016 we had a month-long "UI December" challenge with our digital media class in Metropolia UAS.
We needed an unbiased party to decide the day's UI subject.
So I wrote this simple Node.js script to do just that.

So it:

1. picks a subject line from a text file,
2. wraps it in a random or date-specific text template,
2. sends it to the Slack conversation via webhook and
3. removes the used line from the text file.

## Usage

```sh
SLACK_WEBHOOK_URL=... node index.js path_to_line_file.txt
```
