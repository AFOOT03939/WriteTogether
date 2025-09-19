using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WriteTogether.Models.DB;

public partial class WriteTogetherContext : DbContext
{
    public WriteTogetherContext()
    {
    }

    public WriteTogetherContext(DbContextOptions<WriteTogetherContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Fragment> Fragments { get; set; }

    public virtual DbSet<Story> Stories { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-UPBDLM0;Database=WriteTogether;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.IdCat).HasName("PK__Category__D54686DE785CF133");

            entity.ToTable("Category");

            entity.Property(e => e.IdCat).HasColumnName("id_cat");
            entity.Property(e => e.DateUs)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("date_us");
            entity.Property(e => e.NameUs)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("name_us");
        });

        modelBuilder.Entity<Fragment>(entity =>
        {
            entity.HasKey(e => e.IdFr).HasName("PK__Fragment__00B7F68BBFF74E48");

            entity.ToTable("Fragment");

            entity.Property(e => e.IdFr).HasColumnName("id_fr");
            entity.Property(e => e.AutorFr).HasColumnName("autor_fr");
            entity.Property(e => e.ContentFr).HasColumnName("content_fr");
            entity.Property(e => e.DateUs)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("date_us");
            entity.Property(e => e.StoryFr).HasColumnName("story_fr");

            entity.HasOne(d => d.AutorFrNavigation).WithMany(p => p.Fragments)
                .HasForeignKey(d => d.AutorFr)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Fragment__autor___5535A963");

            entity.HasOne(d => d.StoryFrNavigation).WithMany(p => p.Fragments)
                .HasForeignKey(d => d.StoryFr)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Fragment__story___5629CD9C");
        });

        modelBuilder.Entity<Story>(entity =>
        {
            entity.HasKey(e => e.IdSt).HasName("PK__Story__014858EB40F2D534");

            entity.ToTable("Story");

            entity.Property(e => e.IdSt).HasColumnName("id_st");
            entity.Property(e => e.AutorSt).HasColumnName("autor_st");
            entity.Property(e => e.CategorySt).HasColumnName("category_st");
            entity.Property(e => e.DateUs)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("date_us");
            entity.Property(e => e.PosterSt)
                .HasMaxLength(2083)
                .HasColumnName("poster_st");
            entity.Property(e => e.RateSt).HasColumnName("rate_st");
            entity.Property(e => e.TitleSt)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("title_st");

            entity.HasOne(d => d.AutorStNavigation).WithMany(p => p.Stories)
                .HasForeignKey(d => d.AutorSt)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Story__autor_st__5070F446");

            entity.HasOne(d => d.CategoryStNavigation).WithMany(p => p.Stories)
                .HasForeignKey(d => d.CategorySt)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Story__category___5165187F");

            entity.HasMany(d => d.IdTags).WithMany(p => p.IdSts)
                .UsingEntity<Dictionary<string, object>>(
                    "StoryTag",
                    r => r.HasOne<Tag>().WithMany()
                        .HasForeignKey("IdTag")
                        .HasConstraintName("FK__Story_Tag__id_ta__5FB337D6"),
                    l => l.HasOne<Story>().WithMany()
                        .HasForeignKey("IdSt")
                        .HasConstraintName("FK__Story_Tag__id_st__5EBF139D"),
                    j =>
                    {
                        j.HasKey("IdSt", "IdTag").HasName("PK__Story_Ta__07EAC09475EF6488");
                        j.ToTable("Story_Tag");
                        j.IndexerProperty<int>("IdSt").HasColumnName("id_st");
                        j.IndexerProperty<int>("IdTag").HasColumnName("id_tag");
                    });
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.IdTag).HasName("PK__Tag__6A2987F15A55DB4A");

            entity.ToTable("Tag");

            entity.Property(e => e.IdTag).HasColumnName("id_tag");
            entity.Property(e => e.NameTag)
                .HasMaxLength(50)
                .HasColumnName("name_tag");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.IdUs).HasName("PK__Users__014848A587552CDE");

            entity.Property(e => e.IdUs).HasColumnName("id_us");
            entity.Property(e => e.AvatarUs)
                .HasMaxLength(2083)
                .HasColumnName("avatar_us");
            entity.Property(e => e.DateUs)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("date_us");
            entity.Property(e => e.EmailUs)
                .HasMaxLength(255)
                .HasColumnName("email_us");
            entity.Property(e => e.NameUs)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("name_us");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
