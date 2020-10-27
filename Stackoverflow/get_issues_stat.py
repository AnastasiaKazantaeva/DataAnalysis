import requests
import pandas as pd
import datetime

if __name__ == '__main__':
    page = 1
    per_page = 100
    stackoverflow_url = 'https://api.stackexchange.com'
    tag = 'YOUR_TAG'

    has_more = True
    issues_list = []

    while has_more:
        not_full_url = stackoverflow_url + '/search/advanced?order=asc&sort=creation&site=stackoverflow.com&tagged={}&pagesize={}&page={}'.format(tag, per_page, page)
        response = requests.get(not_full_url)
        issues = response.json()
        # Find if next page exists:
        has_more = issues['has_more']
        page += 1

        # Gather all information about issues
        for i in issues['items']:
            exact_date = datetime.datetime.fromtimestamp(i['creation_date'], datetime.timezone.utc)

            # Add date between two issue's date
            # Check difference between last day with issue and this
            one_day = datetime.timedelta(days=1)
            diff_days = exact_date.date() - issues_list[-1][0] if (len(issues_list) > 0) else one_day
            if diff_days > one_day:
                prev_date = issues_list[-1][0]
                for d in range(1, diff_days.days):
                    day_to_add = prev_date + datetime.timedelta(days=d)
                    issues_list.append([day_to_add, day_to_add.year, day_to_add.month, day_to_add.day])
            issues_list.append([exact_date.date(), exact_date.year, exact_date.month, exact_date.day,
                                i['owner']['display_name'], i['link'], i['is_answered'], i['view_count'],
                                i['answer_count'], ', '.join(i['tags'])])
    # Calling DataFrame constructor on list
    df = pd.DataFrame(issues_list)
    df.columns = ['Date', 'Year', 'Month', 'Day', 'Author', 'Link', 'Is_answered', 'View_count', 'Answer_count', 'Tags']
    df.to_excel('res.xlsx', index=False)
