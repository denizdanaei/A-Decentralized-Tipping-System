# Harvey Journal

## Week 1

- Attend the first lecture, read about the different projects and helped create a group - 4 hours

## Week 2

- Research about Blockchains, XRP, and plugins - 2 hours
- Friday's meeting - group meeting to discuss what we want, who we are, etc. - 1 hour

## Week 3

- Tuesday's Meeting: discussed and created the Moscow requirements and timebline - 3 hours
- Research about Blockchains, XRP, and plugins - 2 hours
- Set up the Javascript environment and played around with firefox plugin tutorials - 1 hour

## Week 4

- Set up the first javascript file that executes a transaction and validates it between two users
        (Based on boilerplate code but this code contained a lot of errors and required bug fixing and refactoring to make it work) - 6 hours
- Tuesdays meeting: Research into which wallets we would use and created XRP wallet and did some test transactions - 2 hours
- Friday's meeting - 1 hour

## Week 5

- Integrate XRP code with Firefox Plugin. Namely research into how to make the transaction.js run without requiring node - 5 hours
- Fixed a bug were the transaction process would never end even after the transaction was already validated
        Was solved by rewriting the entire validation function. - 7 hours
- Initial setup user study - 1 hour        
- Friday's meeting - 1 hour

## Week 6

- Switched surveytool from qualtrics too google form. Helped on and completed the first draft of the user study - 2 hours
- Tuesday's meeting: checked the user study questions with the whole group - 1 hour 
- Implemented a check in transaction.js that checks if the user has enough balance for the tip before making the transaction - 2 hours
- Implemented an exchange rate check. Where the user fills in their amount in euros and the plugin calculates the amount in XRP before
        doing the transaction. (No easy method provided by the XRP API and the XRP web URL that offered this information was unreliable),
        So a lot of time went into finding a different web URL that provides this information and implementing an HTTP GET request that 
        gave the information without throwing a network error. - 6 hours
- Fixed a bug where if the user puts in a tip higher than their balance then they would become unable to make another tip. - 2 hour        
- Together with the group helped integrate the TA's feedback in the user study - 2 hours
- Friday's meeting - 1 hour

## Week 7

- Implemented a social media share button. Multiple social media websites were looked into but only twitter was implemented. For example
        Facebook was looked at but they only have a link sharing and the message would have to be filled in by the user which was to much
        work and too cumbersome for the user so instead only twitter was implemented. - 7 hours
- Implemented a validation message that shows to the user that the transaction was succesful. (Based on earlier code from Deniz) - 1 hour.
- Implemented a message for the user that the transaction is in progress. - 1 hour.
- Finalised the user study with the team. And filled in the HREC tool (had to be done multiple times due to errors in the tool) - 2 hours.
- Friday's meeting - 1 hour

## Week 8

- Asked multiple people and had them fill in the user study (5 people in total) - 2 hours
- Made the UMLs used in the implementation section of the report - 2 hours.
- Wrote the implementation section of the report - 5 hours.
- Friday's meeting - 1 hour

## Week 9

- Wrote the test suit for tipping.js now has a coverage of over 90%. - 9 hours 
- With the group in a skype call helped analyze and fix an error caused by the new version of mozilla firefox (version 75.00) - 1 hour
- Friday's meeting - 1 hour

## Week 10

- Improved the implementation section based on new methods and feedback.
- Cleaned up the code. removed code no longer necessary. moved libraries to its own folder and added comments where needed - 3 hours
- Wrote the conclusion section. 
- Worked on the final presentation.
- Proof read the report for errors and improvements.

