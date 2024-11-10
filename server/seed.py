# Standard library imports
from random import choice, sample

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import User
from config import db

if __name__ == '__main__':
    fake = Faker()

    # Lists of choices
    diet_list = [
    "Gluten Free", "Ketogenic", "Vegetarian","Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal"
    ]
    intolerances_list = [
        'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 
        'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
    ]
    cuisine_list = [
        'African', 'Asian', 'American', 'British', 'Cajun', 
        'Caribbean', 'Chinese', 'Eastern European', 'European', 
        'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 
        'Japanese', 'Jewish', 'Korean', 'Latin American', 
        'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 
        'Southern', 'Spanish', 'Thai', 'Vietnamese'
    ]

    def get_random_choices(choices_list, num_choices):
        return ', '.join(sample(choices_list, min(num_choices, len(choices_list))))

    with app.app_context():
        print("--Deleting all records--")
        # Delete existing data
        User.query.delete()
        
        print("--Creating users--")
        users = []
        usernames = set()

        for _ in range(10):
            username = fake.first_name().lower()
            while username in usernames:
                username = fake.first_name().lower()
            usernames.add(username)

            email = fake.email()
            password = username + 'password'
            
            # Randomly select diet, intolerances, and cuisine
            diet = get_random_choices(diet_list, 3) or None
            intolerance = get_random_choices(intolerances_list, 2) or None
            cuisine = get_random_choices(cuisine_list, 2) or None

            user = User(
                username=username,
                email=email,
                diet=diet,
                intolerance=intolerance,
                cuisine=cuisine
            )

            user.password_hash = password 

            users.append(user)

        db.session.add_all(users)
        db.session.commit()

        print("--Seeding complete--")
