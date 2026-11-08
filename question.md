# Clarifying Questions: Timesheet User Story

Quality characteristics: **Accuracy** and **Consistency**

## Accuracy

1. **How is time rounded when it doesn't fit exactly into half-hour units?** — **[Act on now]**
   Time is tracked in half-hour units, but the text doesn't say what happens to 20 or 50 minutes of work. Is it rounded up, rounded down, or to the nearest half hour? This affects how accurate the history is.
   *Why: Entries must be in half-hour units, so this rule decides which input is valid.*

2. **What is the minimum and maximum amount of time that can be entered?** — **[Act on now]**
   Can a user enter 0 hours, or more than 24 hours in one day? Without limits, totals could be wrong or impossible.
   *Why: These are input checks, like rejecting 0 or negative amounts and setting an upper limit.*

3. **Where does the list of projects come from?** — **[Act on now]**
   "Specific projects" could mean a list kept by an administrator or projects the user types in. If users type free text, spelling differences (for example "Proj A" and "Project A") could split the time for one project across several entries.
   *Why: A timesheet needs a project, so we must decide what counts as a valid one.*

4. **When is the time recorded: against a date, a time range or a timesheet period?** — **[Rule out]**
   The story says "a history of how much time I have spent," but it doesn't say whether entries are tied to a specific day, a start and end time, or a weekly or monthly period. Reports can't be accurate without this.
   *Why: We only track how much time was spent, not when.*

5. **What counts as a "completed" timesheet?** — **[Act on now]**
   A project and an amount of time must be entered to complete one. Does completing it lock the entries? Can they be edited afterwards, and if so, how are changes recorded so the history stays accurate?
   *Why: The story directly says what's needed to complete one, a project and an amount of time.*

## Consistency

6. **How is time shown in all parts of the system?** — **[Act on now]**
   Should half-hour units always appear the same way (for example 1.5, 1:30 or "3 units") in entry, summaries and reports? Different formats could lead to misreading or conversion errors.
   *Why: Totals and history need to show time the same way everywhere.*

7. **Can one timesheet hold several projects, or only one?** — **[Act on now]**
   "A project and amount of time" suggests one project per timesheet. "Track time against specific projects" suggests several. The rules for single and multiple entries need to match.
   *Why: This decides how entries are stored and how totals are added up per project.*

8. **Who exactly is "only I", and does that apply everywhere?** — **[Shelve for later]**
   "Only I should be able to see my tracked time" may conflict with how timesheets usually work, where managers, admins or payroll need to see them. Is the restriction the same across screens, reports, exports and APIs?
   *Why: There's only one user for now. Other users and roles may matter later.*

9. **Why is the half-hour unit used, and does it apply to every project and user?** — **[Rule out]**
   If some projects or roles need finer tracking (for example 15 minutes), applying half-hour units everywhere could make the data inconsistent. Is the unit fixed for the whole system or can it be configured?
   *Why: The requirement fixes the unit at half an hour.*

10. **What happens when entries overlap or are duplicated?** — **[Rule out]**
    If a user logs the same half hour against two projects, or submits the same entry twice, should the system block it, warn the user or allow it? A consistent rule is needed so totals don't count the same time twice.
    *Why: Two entries can only overlap if we know when the work happened, which we don't track. Two entries for one project just add up. If accidental duplicates should be flagged, move this to "Shelve for later".*

## Summary

| Group | Questions |
|-------|-----------|
| Act on now | 1, 2, 3, 5, 6, 7 |
| Shelve for later | 8 |
| Rule out | 4, 9, 10 |
