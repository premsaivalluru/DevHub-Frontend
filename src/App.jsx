import {
  Search,
  ExternalLink,
  MapPin,
  CalendarDays,
  UsersRound,
  Star,
  GitFork,
  TrendingUp,
  Clock3,
  Languages,
  GitBranch,
  FolderGit2,
} from "lucide-react";
import StatCard from './components/StatCard';
import ActivityChart from "./components/ActivityChart";
import LanguageChart from "./components/LanguageChart";
import { useState } from "react";


export default function App() {

  const [searched, setSearched] = useState(false);
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(username) {

    setLoading(true);
    setError(null);

    try {

      const response = await fetch("https://devhub-backend-94hm.onrender.com/get_user_data", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: username
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze GitHub user");
      }
      const data = await response.json();
      setGithubData(data);
      setSearched(true);

    } catch (error) {

      console.error(error);
      setError(error.message);

    } finally {

      setLoading(false);

    }
  }

  return (
    <div>

      <Header onSearch={handleSearch} />

      {loading && (
        <div className="text-center text-white mt-10">
          Analyzing GitHub profile...
        </div>
      )}

      {error && (
        <div className="text-center text-red-400 mt-10">
          {error}
        </div>
      )}

      {!searched && !loading && !error && (
        <EmptyState />
      )}

      {searched && githubData && !loading && (
        <>
          <Profile data={githubData} />

          <RepoStats data={githubData} />

          <AnalyticsSection data={githubData} />

          <RecentRepos data={githubData} />
        </>
      )}
    </div>
  );
}


function Header({ onSearch }) {
  const [username, setUsername] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim()) return;

    onSearch(username.trim());
  }

  return (
    <header className="flex bg-[#0F172A] justify-between items-center w-auto p-4 md:gap-4 shadow-md text-white">

      <div className="flex items-center text-xl md:text-3xl font-bold">
        <span>Dev</span>
        <span className="text-[#4523A4]">Hub</span>
      </div>

      <div className="flex items-center md:space-x-4">
        <form onSubmit={handleSubmit}>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username..."
            className="w-40 h-[35px] px-4 py-2 rounded-lg bg-[#1E293B] md:w-[350px] text-white focus:outline-none focus:ring-2 focus:ring-[#4523A4]"
          />

          <button
            type="submit"
            className="text-center ml-2 w-[70px] h-[35px] rounded-lg bg-[#4523A4] text-white hover:bg-[#5E3ABF]"
          >
            Search
          </button>

        </form>
      </div>

    </header>
  );
}

function EmptyState() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
      <div className="text-center">

        <div className="text-5xl mb-4">
          🔍
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Enter a GitHub username to start analysis
        </h1>

        <p className="text-gray-400 mt-3">
          Search for a GitHub profile to view repositories,
          activity, languages, and developer statistics.
        </p>

      </div>
    </div>
  );
}

function Profile({data}) {
  return (
    <div className="flex flex-col w-full max-w-375 mx-auto md:flex-row items-center justify-between rounded-2xl p-4 gap-1 mt-2 md:mt-4 md:gap-4 md:shadow-md bg-[#091122] md:bg-[#3B414E]/40 text-white">
      <ProfileDetails data={data} />
      <ProfileStats data={data} />
    </div>
  );
}

function ProfileDetails({ data }) {
  const profile = data.profile;
  const avatar_url = profile.avatar_url;

  return (
    <div className="relative flex items-center justify-around w-full h-40 rounded-2xl gap-4 bg-[#3B414E]/40 md:rounded-none md:bg-transparent md:shadow-none md:gap-8 
      md:after:absolute md:after:right-0 md:after:top-1/4 md:after:h-1/2 md:after:w-[1px] md:after:bg-gray-700">

      <div
        className="profile-image rounded-full ml-2 md:ml-3 w-34 h-24 bg-cover bg-center flex items-center justify-center text-2xl font-bold"
        style={{ backgroundImage: `url(${avatar_url})` }}
      ></div>

      <div className="flex flex-col gap-1 pt-1 w-full">

        <span className="text-xl font-bold">
          {profile.name}
        </span>

        <a
          href={profile.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4523A4] hover:underline"
        >
          @{profile.login}
        </a>

        <p className="text-sm">
          {profile.bio}
        </p>

        <div className="flex gap-3 md:gap-4">
          <span className="date flex gap-1 text-sm">
            <CalendarDays size={15} className="mt-1" />
            Joined {profile.created_at}
          </span>
        </div>

      </div>

    </div>
  );
}

function ProfileStats({data}) {
  const profile = data.profile
  return (
    <div className="flex justify-between items-center p-4 gap-4 w-full h-40 rounded-2xl shadow-md bg-[#3B414E]/40 md:bg-transparent md:mt-0 mt-4 md:shadow-none">
      <StatCard 
        icon={FolderGit2} 
        count={profile.public_repos} 
        label="Public Repositories" 
        iconColor="text-sky-500"
        showDivider={true} 
      />
      <StatCard 
        icon={UsersRound} 
        count={profile.followers} 
        label="Followers" 
        iconColor="text-green-500"
        showDivider={true} 
      />
      <StatCard 
        icon={UsersRound} 
        count={profile.following} 
        label="Following" 
        iconColor="text-orange-500"
        showDivider={false} 
      />
    </div>
  );
}

function RepoStats({data}) {
  const repo = data.repos
  const commits = data.activity.total_commits
  return (
    <div className = "flex bg-[#3B414E]/40 m-4 mt-2 md:mt-4 p-4 gap-2 md:gap-4 w-auto md:w-full md:max-w-375 md:mx-auto rounded-2xl h-40">
      <StatCard
        icon={Star}
        count = {repo.total_stars}
        label = "Total Stars"
        iconColor = "text-[#4523A4]"
        showDivider = {true}
        className = ""
      />
      <StatCard
        icon={GitFork}
        count = {repo.total_forks}
        label = "Total Forks"
        iconColor = "text-green-500"
        showDivider = {true}
        className = ""
      />
      <StatCard
        icon={TrendingUp}
        count = {commits}
        label = "Total Commits(Last 30 days)"
        iconColor = "text-sky-500"
        showDivider = {false}
        className = ""
      />
    </div>
  )
}

function AnalyticsSection({data}) {

  const activityData = Object.entries(
    data.activity.activity_graph_data
  ).map(([date, commits]) => ({
    date,
    commits
  }));

  const languages = data.repos.languages;

  const commits = data.activity.total_commits;

  return (
    <section className="w-auto md:w-full md:max-w-375 mx-4 md:mx-auto mt-2 md:mt-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4">
        <div className="w-full min-w-0 rounded-2xl bg-[#3B414E]/40 p-5 md:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-white">
                Commit Activity
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Last 30 days
              </p>
            </div>
            <div className="text-sm text-gray-400">
              {commits} commits
            </div>
          </div>
          <ActivityChart activity={activityData} />
        </div>
        <div className="w-full min-w-0 rounded-2xl bg-[#3B414E]/40 p-5 md:p-6 shadow-md">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4">
            Top Languages
          </h2>
          <LanguageChart languages={languages} />
        </div>
      </div>
    </section>
  );
}

function RecentRepos({data}) {
  const recentRepos = data.repos.recent_repos
  return (
    <section className="w-auto md:w-full md:max-w-375 mx-4 md:mx-auto mt-2 md:mt-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Recently Updated Repositories
        </h2>
        <span className="text-xs md:text-sm text-gray-400">
          {recentRepos.length} repositories
        </span>
      </div>
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-3
      ">
        {recentRepos.map((repo) => (
          <div
            key={repo.html_url}
            className="
              rounded-xl
              bg-[#3B414E]/40
              border border-[#475569]/30
              p-4
              hover:bg-[#3B414E]/60
              transition
              duration-200
              min-w-0
            "
          >
            <div className="flex items-start gap-2 min-w-0">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  items-center
                  gap-1.5
                  min-w-0
                  text-base
                  font-semibold
                  text-[#A78BFA]
                  hover:text-[#C4B5FD]
                  hover:underline
                "
                title={`Open ${repo.name} on GitHub`}
              >
                <span className="truncate">
                  {repo.name}
                </span>

                <ExternalLink
                  size={14}
                  className="shrink-0"
                  aria-hidden="true"
                />
              </a>
            </div>
            <div className="
              flex
              items-center
              gap-4
              mt-4
              text-xs
              text-gray-400
            ">
              {repo.language && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22B8CF]" />
                  <span>
                    {repo.language}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star
                  size={14}
                  className="text-yellow-400"
                />
                <span>
                  {repo.stargazers_count}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork
                  size={14}
                  className="text-green-400"
                />
                <span>
                  {repo.forks_count}
                </span>
              </div>
            </div>
            <div className="
              flex
              items-center
              gap-1.5
              mt-3
              text-xs
              text-gray-500
            ">
              <Clock3 size={13} />
              <span>
                Updated {formatUpdatedDate(repo.updated_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatUpdatedDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}