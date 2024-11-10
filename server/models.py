import datetime
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates, relationship
from sqlalchemy.ext.mutable import MutableList
import re
import json


from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ("-user_restaurant.user",)
    
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(40), nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    diet = db.Column(db.Text) 
    intolerance = db.Column(db.Text)  
    cuisine = db.Column(db.Text) 

    user_restaurant = db.relationship('UserRestaurant', back_populates='user', lazy=True, cascade='all, delete-orphan')

    @validates('username')
    def validate_username(self, key, username):
        if User.query.filter_by(username=username).first():
            raise ValueError('Username already exists')
        if not (3 <= len(username) <= 25):
            raise ValueError('Username must be between 3 and 25 characters long')
        return username

    @validates('email')
    def validate_email(self, key, email):
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
            raise ValueError('Invalid email format')
        if User.query.filter_by(email=email).first():
            raise ValueError('Email already exists')
        return email
    
    @validates('_password_hash')
    def validate_password(self, key, password):
        if len(password) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', password):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', password):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', password):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[@$!%*?&#]', password):
            raise ValueError('Password must contain at least one special character (@$!%*?&#)')
        return password
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def update_password(self, new_password):
        self.password_hash = new_password 
        db.session.commit()

    def update_username(self, new_username):
        if User.query.filter_by(username=new_username).first():
            raise ValueError('Username already exists')
        self.username = new_username
        db.session.commit()

    def update_email(self, new_email):
        if User.query.filter_by(email=new_email).first():
            raise ValueError('Email already exists')
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', new_email):
            raise ValueError('Invalid email format')
        self.email = new_email
        db.session.commit()

    @property
    def diet_list(self):
        return json.loads(self.diet) if self.diet else []

    @diet_list.setter
    def diet_list(self, value):
        self.diet = json.dumps(value)

    @property
    def intolerance_list(self):
        return json.loads(self.intolerance) if self.intolerance else []

    @intolerance_list.setter
    def intolerance_list(self, value):
        self.intolerance = json.dumps(value)

    @property
    def cuisine_list(self):
        return json.loads(self.cuisine) if self.cuisine else []

    @cuisine_list.setter
    def cuisine_list(self, value):
        self.cuisine = json.dumps(value)

    def __repr__(self):
        return f'ID: {self.id}, User: {self.username}, Email: {self.email}'
    
class Recipe(db.Model, SerializerMixin):
    __tablename__ = 'recipes'

    # serialize_rules = ('-user_recipe',)

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    image = db.Column(db.String, nullable=True)
    preparation_time = db.Column(db.Integer, nullable=True) 
    cooking_time = db.Column(db.Integer, nullable=True)  
    servings = db.Column(db.Integer, nullable=True)
    cuisine = db.Column(db.String, nullable=True)
    rating = db.Column(db.Float, nullable=True)

    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name) > 100:
            raise ValueError('Name must be between 1 and 100 characters long')
        return name

    @validates('ingredients')
    def validate_ingredients(self, key, ingredients):
        if not ingredients:
            raise ValueError('Ingredients are required')
        return ingredients
    
    @validates('instructions')
    def validate_instructions(self, key, instructions):
        if not instructions:
            raise ValueError('Instructions are required')
        return instructions

    @validates('rating')
    def validate_rating(self, key, rating):
        if rating is not None and not (0 <= rating <= 5):
            raise ValueError('Rating must be between 0 and 5')
        return rating
    
    def __repr__(self):
        return f'ID: {self.id}, Name: {self.name}, Cuisine: {self.cuisine}, Rating: {self.rating}'


class Restaurant(db.Model, SerializerMixin):
    __tablename__ = 'restaurants'

    serialize_rules = ('-user_restaurant',)

    id = db.Column(db.String(255), primary_key=True) 
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    cuisine_type = db.Column(db.String(255), nullable=True)
    rating = db.Column(db.Float, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    hours_of_operation = db.Column(db.Text, nullable=True)  
    menu_url = db.Column(db.String(255), nullable=True)
    display_phone = db.Column(db.String(50), nullable=True) 

    user_restaurant = db.relationship('UserRestaurant', back_populates='restaurant', lazy=True, cascade='all, delete-orphan')


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'cuisine_type': self.cuisine_type,
            'rating': self.rating,
            'image_url': self.image_url,
            'hours_of_operation': self.hours_of_operation,
            'menu_url': self.menu_url,
            'display_phone': self.display_phone
        }
    
    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name) > 100:
            raise ValueError('Name must be between 1 and 100 characters long')
        return name
    
    @validates('address')
    def validate_address(self, key, address):
        if not address:
            raise ValueError('Address cannot be empty')
        return address

    @validates('cuisine_type')
    def validate_cuisine_type(self, key, cuisine_type):
        if cuisine_type and len(cuisine_type) > 50:
            raise ValueError('Cuisine type must be 50 characters or less')
        return cuisine_type

    @validates('rating')
    def validate_rating(self, key, rating):
        if rating is not None and (rating < 1 or rating > 5):
            raise ValueError('Rating must be an integer between 1 and 5')
        return rating

    def __repr__(self):
        return (f'ID: {self.id}, Name: {self.name}, Address: {self.address}, '
                f'Cuisine: {self.cuisine_type}, Rating: {self.rating}, '
                f'Image URL: {self.image_url}, Hours: {self.hours_of_operation}, '
                f'Menu URL: {self.menu_url}, Phone: {self.display_phone}')

class UserRestaurant(db.Model, SerializerMixin):
    __tablename__ = 'user_restaurant'

    serialize_rules = ("-user.user_restaurant", "-restaurant.user_restaurant",)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    restaurant_id = db.Column(db.String, db.ForeignKey('restaurants.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    image_url = db.Column(db.String, nullable=True)
    rating = db.Column(db.Float, nullable=True)
    address = db.Column(db.String, nullable=True)

    user = db.relationship('User', back_populates='user_restaurant')
    restaurant = db.relationship('Restaurant', back_populates='user_restaurant')

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Name cannot be empty.")
        if len(name) > 200:
            raise ValueError("Name cannot be longer than 200 characters.")
        return name

    @validates('rating')
    def validate_rating(self, key, rating):
        if rating is not None:  # Rating is nullable, so we check if it's provided
            if rating < 0 or rating > 5:
                raise ValueError("Rating must be between 0 and 5.")
            if rating % 0.5 != 0:
                raise ValueError("Rating must be in increments of 0.5.")
        return rating

    @validates('address')
    def validate_address(self, key, address):
        if address and len(address) > 255:
            raise ValueError("Address cannot be longer than 255 characters.")
        return address


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'restaurant_id': self.restaurant_id,
            'name': self.name,
            'image_url': self.image_url,
            'rating': self.rating,
            'address': self.address
        }

    def __repr__(self):
        return f'ID: {self.id}, User ID: {self.user_id}, Restaurant ID: {self.restaurant_id}, Rating: {self.rating}'

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    title = db.Column(db.String, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False) 

    @validates('title')
    def validate_title(self, key, title):
        if not title:
            raise ValueError("Title cannot be empty.")
        if len(title) > 255:
            raise ValueError("Title cannot be longer than 255 characters.")
        return title

    @validates('comment')
    def validate_comment(self, key, comment):
        if not comment:
            raise ValueError("Comment cannot be empty.")
        return comment

    @validates('rating')
    def validate_rating(self, key, rating):
        if rating < 0 or rating > 5:
            raise ValueError("Rating must be between 0 and 5.")
        if rating % 0.5 != 0:
            raise ValueError("Rating must be in increments of 0.5.")
        return rating
        

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'recipe_id': self.recipe_id,
            'title': self.title,
            'comment': self.comment,
            'rating': self.rating,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'ID: {self.id}, Title: {self.title}, RecipeID: {self.recipe_id}, Created: {self.created_at}' 