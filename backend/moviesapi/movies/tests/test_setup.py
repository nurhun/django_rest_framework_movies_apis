from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from movies.models import Movie

class TestSetUp(APITestCase):

    def setUp(self) -> None:
        # print("Start setUp")

        Movie.objects.create(title="Movie 1",description= "Movie 1 description",year= 2022,story_line= "Movie 1 story line")
        Movie.objects.create(title="Movie 2",description= "Movie 2 description",year= 2022,story_line= "Movie 2 story line")
        Movie.objects.create(title="Movie 3",description= "Movie 3 description",year= 2022,story_line= "Movie 3 story line")
        Movie.objects.create(title="Movie 4",description= "Movie 4 description",year= 2022,story_line= "Movie 4 story line")
        Movie.objects.create(title="Movie 5",description= "Movie 5 description",year= 2022,story_line= "Movie 5 story line")

        self.user = User.objects.create_user(
            username='testuser1', 
            password='testuser1_secret_password',
            email='testuser1@test.com'
        )

        self.movies = Movie.objects.all()

        # print(type(self.movies))
        # for movie in self.movies:
        #     print(movie)
        self.client = APIClient()
        self.client.login(username=self.user.username, password="testuser1_secret_password")

        return super().setUp()


    def tearDown(self) -> None:
        # print("Start tearDown")
        return super().tearDown()